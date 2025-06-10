export async function before(m, { command }) {
    global.db.data.blockedCommands = global.db.data.blockedCommands || []

    if (global.db.data.blockedCommands.includes(command)) {
        throw `❌ الأمر *${command}* مقيد حاليًا.`
    }
}
