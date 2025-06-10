const { proto, generateWAMessage, areJidsSameUser } = (await import('baileys-pro')).default;

export async function all(m, chatUpdate) {
  if (m.isBaileys || !m.message) return;

  const msgTypes = m.message.buttonsResponseMessage || m.message.templateButtonReplyMessage ||
                   m.message.listResponseMessage || m.message.interactiveResponseMessage;
  if (!msgTypes) return;

  let id =
    m.message.buttonsResponseMessage?.selectedButtonId ||
    m.message.templateButtonReplyMessage?.selectedId ||
    m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
    (() => {
      try {
        return JSON.parse(m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson)?.id;
      } catch {
        return '';
      }
    })();

  let text =
    m.message.buttonsResponseMessage?.selectedDisplayText ||
    m.message.templateButtonReplyMessage?.selectedDisplayText ||
    m.message.listResponseMessage?.title ||
    m.message.interactiveResponseMessage?.body?.text;

  let isIdMessage = false;
  let usedPrefix = '';
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (!plugin || plugin.disabled) continue;
    if (!opts['restrict'] && plugin.tags?.includes('admin')) continue;
    if (typeof plugin !== 'function' || !plugin.command) continue;

    const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    const _prefix = plugin.customPrefix || this.prefix || global.prefix || '';

    let match;
    if (_prefix instanceof RegExp) {
      match = [[_prefix.exec(id), _prefix]];
    } else if (Array.isArray(_prefix)) {
      match = _prefix.map(p => {
        const re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
        return [re.exec(id), re];
      });
    } else if (typeof _prefix === 'string') {
      match = [[new RegExp(str2Regex(_prefix)).exec(id), new RegExp(str2Regex(_prefix))]];
    } else {
      match = [[[null], new RegExp]];
    }

    const result = match.find(p => p[0]);
    if (result) {
      usedPrefix = result[0][0] || '';
    }

    const noPrefix = usedPrefix ? id.replace(usedPrefix, '') : id;
    let [command] = noPrefix.trim().split(' ').filter(Boolean);
    command = (command || '').toLowerCase();

    const isId =
      plugin.command instanceof RegExp
        ? plugin.command.test(command)
        : Array.isArray(plugin.command)
        ? plugin.command.some(cmd => (cmd instanceof RegExp ? cmd.test(command) : cmd === command))
        : typeof plugin.command === 'string'
        ? plugin.command === command
        : false;

    if (isId) {
      isIdMessage = true;
      break;
    }
  }

  const messages = await generateWAMessage(
    m.chat,
    { text: isIdMessage ? id : text, mentions: m.mentionedJid },
    {
      userJid: this.user.id,
      quoted: m.quoted?.fakeObj,
    }
  );

  messages.key.fromMe = areJidsSameUser(m.sender, this.user.id);
  messages.key.id = m.key.id;
  messages.pushName = m.name;
  if (m.isGroup) messages.key.participant = messages.participant = m.sender;

  const msg = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(messages)].map(v => ((v.conn = this), v)),
    type: 'append',
  };

  this.ev.emit('messages.upsert', msg);
}
