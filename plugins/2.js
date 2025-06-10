import axios from 'axios';
import * as cheerio from 'cheerio';
import { Sticker } from 'wa-sticker-formatter';

async function gifsSearch(q) {
    try {
        const searchUrl = `https://tenor.com/search/${q}-gifs`;
        const { data } = await axios.get(searchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(data);
        const results = [];

        $("figure.UniversalGifListItem").each((i, el) => {
            const $el = $(el);
            const img = $el.find("img");
            const gifUrl = img.attr("src");
            const alt = img.attr("alt") || "No description";
            const detailPath = $el.find("a").first().attr("href");

            if (gifUrl && gifUrl.endsWith('.gif') && detailPath) {
                results.push({
                    gif: gifUrl,
                    alt,
                    link: "https://tenor.com" + detailPath
                });
            }
        });

        return results;
    } catch (error) {
        console.error("Error fetching GIFs:", error);
        return [];
    }
}

const handler = async (m, { conn, text, command }) => {
    if (!text) throw `استخدم: .${command} <اسم الشخصية> <العدد>\nمثال:\n.${command} Gojo 5`;

    const [query, countStr] = text.split(/(?<=^\S+)\s/);
    const count = Math.min(Number(countStr) || 1, 30);
    const results = await gifsSearch(query);
    if (!results.length) throw 'ما لقيتش أي صور متحركة بالشخصية هاذي!';

    const usedIndexes = new Set();
    const picks = [];

    while (picks.length < count && usedIndexes.size < results.length) {
        const i = Math.floor(Math.random() * results.length);
        if (!usedIndexes.has(i)) {
            usedIndexes.add(i);
            picks.push(results[i]);
        }
    }

    for (const pick of picks) {
        try {
            const { data } = await axios.get(pick.gif, { responseType: 'arraybuffer' });

            const sticker = new Sticker(data, {
                type: 'full',
                pack: '𝙋𝘼𝘾𝙆 𝘽𝙔 - 𝐈𝐂𝐇𝐈𝐆𝐎', // هنا اسم الحزمة
                author: '𝑴𝑰𝑿 𝑳𝑼𝑭𝑭𝒀',  
                quality: 70
            });

            const buffer = await sticker.toBuffer();
            await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
        } catch (e) {
            console.error(`فشل تحويل أو إرسال GIF: ${pick.gif}`, e);
        }
    }
};

handler.help = ['gif-sticker'];
handler.tags = ['sticker'];
handler.command = ['2'];
handler.limit = 1;

export default handler;
