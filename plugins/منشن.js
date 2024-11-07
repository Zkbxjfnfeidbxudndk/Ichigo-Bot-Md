let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    // جلب بيانات المجموعة
    const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {};
    const subject = groupMetadata.subject || "اسم المجموعة"; // اسم المجموعة
    const totalMembers = participants.length; // عدد الأعضاء

    const listAdmin = participants
        .filter(participant => participant.admin === 'admin' || participant.admin === 'superadmin')
        .map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`)
        .join('\n');

    let pesan = args.join` `;
    let oi = `*🗿 اصحى ياض منك له*\n*═━─━━═━─━═💗═━─━━═━━─━*\n ${pesan}`;
    let teks = `**✦⃝اسم المجموعه💝* ${subject}\n`;
    teks += `*✦⃝اعـضـاء الـمـجـمـوعـه❄️* ${totalMembers}\n\n*منشن*\n\n${oi}\n\n`;

    teks += `*⃝✦مشــرفــين المجموعه👑*\n`;
    teks += `${listAdmin}\n`;
    teks += `*✦⃝اعـضـاء الـمـجـمـوعـه❄️*\n`;

    for (let mem of participants) {
        teks += `┃⊹ @${mem.id.split('@')[0]}\n`;
    }

    teks += `┃ 𝙄𝘾𝙃𝙄𝙂𝙊 𝘽𝙊𝙏-𝙈𝘿 𖤍🍷\n`;
    teks += `*═━─━━═━─━═💗═━─━━═━━─━*`;

    await conn.sendMessage(
        m.chat,
        { 
            image: { url: 'https://qu.ax/tsjVW.jpg';' }, 
            caption: teks, 
            mentions: participants.map(a => a.id) 
        }
    );
}

handler.command = /^(منشن)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
export default handler;
