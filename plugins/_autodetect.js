import pkg from 'baileys-pro';
const WAMessageStubType = pkg.default;

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return;

    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            contactMessage: {
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    let chat = global.db.data.chats[m.chat];
    let usuario = `@${m.sender.split`@`[0]}`;
    let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://qu.ax/QGAVS.jpg';

    let messages = {
        nombre: `⌬──══┈•⤣🪐⤤•┈══──⌬
◈╎ \`تـم تـعـديـل اسـم الـمـجـمـوعـة\`
── • ◈ • ──
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨بواسـطـة: ${usuario}
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨الاسم الجـديـد: *${m.messageStubParameters[0]}*
───── ꒰ა⋟﹏⋞໒꒱ ─────
⌬──══┈•⤣🪐⤤•┈══──⌬`,

        foto: `⌬──══┈•⤣🪐⤤•┈══──⌬
◈╎ \`تـم تـغـيـيـر صـورة الـمـجـمـوعـة\`
── • ◈ • ──
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨بواسـطـة: ${usuario}
───── ꒰ა⋟﹏⋞໒꒱ ─────
⌬──══┈•⤣🪐⤤•┈══──⌬`,

        edit: `⌬──══┈•⤣🪐⤤•┈══──⌬
◈╎ \`تـم تـعـديـل إعـدادات الـدردشـة\`
── • ◈ • ──
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨بواسـطـة: ${usuario}
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨التـحـديـث: الآن يمكن لـ *${m.messageStubParameters[0] == 'on' ? 'الإداريين فقط' : 'الجميع'}* التحدث
───── ꒰ა⋟﹏⋞໒꒱ ─────
⌬──══┈•⤣🪐⤤•┈══──⌬`,

        newlink: `⌬──══┈•⤣🪐⤤•┈══──⌬
◈╎ \`تـم تـغـيـيـر رابـط الـدعـوة\`
── • ◈ • ──
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨بواسـطـة: ${usuario}
───── ꒰ა⋟﹏⋞໒꒱ ─────
⌬──══┈•⤣🪐⤤•┈══──⌬`,

        status: `⌬──══┈•⤣🪐⤤•┈══──⌬
◈╎ \`تـم تـغـيـيـر حـالـة الـمـجـمـوعـة\`
── • ◈ • ──
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨بواسـطـة: ${usuario}
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨الـوضـع: الآن يمكن لـ *${m.messageStubParameters[0] == 'on' ? 'الإداريين فقط' : 'الجميع'}* التحدث
───── ꒰ა⋟﹏⋞໒꒱ ─────
⌬──══┈•⤣🪐⤤•┈══──⌬`,

        admingp: `⌬──══┈•⤣🪐⤤•┈══──⌬
◈╎ \`تـم تـرقـيـة عـضـو للإدارة\`
── • ◈ • ──
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨بواسـطـة: ${usuario}
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨العـضـو: @${m.messageStubParameters[0].split`@`[0]}
───── ꒰ა⋟﹏⋞໒꒱ ─────
⌬──══┈•⤣🪐⤤•┈══──⌬`,

        noadmingp: `⌬──══┈•⤣🪐⤤•┈══──⌬
◈╎ \`تـم إزالـة عـضـو مـن الإدارة\`
── • ◈ • ──
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨بواسـطـة: ${usuario}
◞🪶◜⇓ ۬.͜ـ🌗˖ ⟨العـضـو: @${m.messageStubParameters[0].split`@`[0]}
───── ꒰ა⋟﹏⋞໒꒱ ─────
⌬──══┈•⤣🪐⤤•┈══──⌬`
    };

    let stubTypeActions = {
        21: "nombre",
        22: "foto",
        23: "newlink",
        25: "edit",
        26: "status",
        29: "admingp",
        30: "noadmingp"
    };

    if (chat.detect && stubTypeActions[m.messageStubType]) {
        let messageKey = stubTypeActions[m.messageStubType];
        let sendOptions = { mentions: [m.sender] };

        if (messageKey === "foto") {
            await conn.sendMessage(m.chat, { image: { url: pp }, caption: messages[messageKey], ...sendOptions }, { quoted: fkontak });
        } else if (messageKey === "admingp" || messageKey === "noadmingp") {
            await conn.sendMessage(m.chat, { text: messages[messageKey], mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak });
        } else {
            await conn.sendMessage(m.chat, { text: messages[messageKey], ...sendOptions }, { quoted: fkontak });
        }
    } else {
        console.log({
            messageStubType: m.messageStubType,
            messageStubParameters: m.messageStubParameters,
            type: WAMessageStubType[m.messageStubType]
        });
    }
}
