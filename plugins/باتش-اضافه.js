import fs from 'fs';
import path from 'path';

// دالة لإنشاء أو تعديل الملف
let createOrAppendFile = async (filename, data) => {
    let filePath = path.join('plugins', filename);

    try {
        // التحقق مما إذا كان الملف موجودًا
        const fileExists = fs.existsSync(filePath);
        if (fileExists) {
            // إذا كان الملف موجودًا، يتم إضافة البيانات إلى الملف
            await fs.promises.appendFile(filePath, data + '\n', 'utf8');
            console.log(`تم إضافة البيانات إلى الملف ${filename} بنجاح.`);
        } else {
            // إذا لم يكن الملف موجودًا، يتم إنشاء الملف
            await fs.promises.writeFile(filePath, data, 'utf8');
            console.log(`تم إنشاء الملف ${filename} بنجاح.`);
        }
    } catch (err) {
        console.error(`فشل في إنشاء أو تعديل الملف ${filename}: ${err.message}`);
        throw err;
    }
};

// المعالج للأمر
let handler = async (m, { isROwner, usedPrefix, command, text }) => {
    await m.reply(global.wait);  // يرسل رسالة انتظار
    if (!isROwner) return;  // يتحقق مما إذا كان المستخدم مالكًا

    // التحقق مما إذا تم الرد على كود
    let replyCode = m.quoted && m.quoted.text ? m.quoted : null;

    let filename;

    // إذا تم الرد على كود
    if (replyCode) {
        if (!text) throw `يرجى تحديد اسم الملف، مثال:\n${usedPrefix + command} example |`;
        filename = text.trim();

        if (!filename.endsWith('.js')) {
            filename += '.js';
        }

        const codeData = replyCode.text; // استخدم نص الرسالة المقتبسة

        // إضافة البيانات إلى الكود الموجود
        await createOrAppendFile(filename, codeData);
        m.reply(`تم إضافة البيانات إلى الملف ${filename} بنجاح.`);
    } else {
        // إذا لم يتم الرد على كود، تحقق من النص
        if (!text) {
            throw `يرجى تحديد اسم الملف والبيانات لإنشاء الملف، مثال:\n${usedPrefix + command} example.js | <البيانات>`;
        }

        // فصل اسم الملف والبيانات من النص المدخل
        let parts = text.split('|');
        filename = parts[0].trim();
        if (!filename.endsWith('.js')) {
            filename += '.js';
        }
        const data = parts.slice(1).join('|').trim();

        if (!data) {
            throw `يرجى تحديد البيانات لإنشاء أو تعديل الملف، مثال:\n${usedPrefix + command} example.js | <البيانات>`;
        }

        // إضافة البيانات إلى الكود الموجود
        await createOrAppendFile(filename, data);
        m.reply(`تم إضافة البيانات إلى الملف ${filename} بنجاح.`);
    }
};

// إعدادات المساعدة والتصنيف والأمر
handler.help = ['createplugin', 'addplugin'];
handler.tags = ['owner'];
handler.command = /^(gps|باتش-اضافه|ضيف|addp|addplugin)$/i;
handler.rowner = true;

export default handler;
