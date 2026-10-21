const Database = require('better-sqlite3');
const db = new Database('bot_database.db'); // new db file

// a table for mod logs (bans, kicks, warnings, etc.)
db.exec(`
    CREATE TABLE IF NOT EXISTS mod_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        moderator_id TEXT NOT NULL,
        action TEXT NOT NULL,
        reason TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log('SQLite database connected and tables initialized.');

module.exports = db;