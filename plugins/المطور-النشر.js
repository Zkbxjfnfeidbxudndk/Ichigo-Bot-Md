
// استيراد المكتبات
import { prepareWAMessageMedia, generateWAMessageFromContent } from  @whiskeysockets/baileys ;


let handler = async (m, { conn, text, args, command }) => {

  if (command ===  النشر ) {
  const pesan = m.quoted && m.quoted.text ? m.quoted.text : text;
  if (!pesan) return conn.sendMessage(m.chat, { text:  ادخل نص الرساله اولا  }, { quoted: m });

  // جلب كل المجموعات
  const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith( @g.us ) && chat.isChats);

  if (groups.length === 0) {
    return conn.sendMessage(m.chat, { text:  لا توجد مجموعات متاحة لإرسال الرسالة إليها.  }, { quoted: m });
  }
  
  
  const imgurl =  https://qu.ax/tsjVW.jpg ;
  
  const mediaMessage = await prepareWAMessageMedia({ image: { url: imgurl } }, { upload: conn.waUploadToServer });

const groupMessage = `يرجى اختيار مجموعة لإرسال الرسالة:\n\n`;

const rows = groups.map(([id, chat, index]) => (
    
    { 
    header: `المجــموعة رقـم : [${index + 1}]`, 
    title: `${chat.subject}`, 
    description:   , 
    id: `._النشر ${id} ${pesan}` 
    }
    
    ));

const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: groupMessage },
          footer: { text: wm },
          header: {
            hasMediaAttachment: true,
            imageMessage: mediaMessage.imageMessage
          },
          nativeFlowMessage: {
            buttons: [
              {
                name:  single_select ,
                buttonParamsJson: JSON.stringify({
                  title:  「 قــائــمــة المجــموعات 」 ,
                  sections: [
                    {
                  title:  「 قائــمة المجــموعات 」 ,
                  highlight_label: wm,
                  rows: rows
                      
                    }
                  ]
                })
              }
            ]
          }
        }
      }
    }
  }, { userJid: conn.user.jid, quoted: m });
    
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

} else if (command ===  _النشر ) {

const groupId = args[0]; 
const textMessage = args.slice(1).join(   );


  if (!groupId || !textMessage) {
    return conn.reply(m.chat,  يرجى توفير اسم المجموعة والنص المطلوب. , m);
  }

  const formattedMessage = `اعلام من المطور :\n\nالاعلام: ${textMessage}\n\n> المطور: @${m.sender.split( @ )[0]}\n> انا: ${wm}\n> ملاحظه: يرجى أتباع التعليمات.`;
  await conn.sendMessage(groupId, { text: formattedMessage, mentions: [m.sender] }, { quoted: m });
  m.reply( تم إرسال الرسالة إلى المجموعة المحددة! );
}

};

handler.help = [ tx ];
handler.tags = [ owner ];
handler.command = /^(النشر|_النشر)$/i;

handler.rowner = true;

export default handler;
