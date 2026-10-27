import db from '../database.js';

// Cooldown tracker to prevent XP spam (1 minute per user)
const cooldowns = new Set();

export async function handleLeveling(message) {
    if (message.author.bot || !message.guild) return;

    const userId = message.author.id;
    const guildId = message.guild.id;
    const cooldownKey = `${guildId}-${userId}`;

    if (cooldowns.has(cooldownKey)) return;
    cooldowns.add(cooldownKey);
    setTimeout(() => cooldowns.delete(cooldownKey), 60000);

    // 1. Get or create user record in SQLite
    let userRow = db.prepare(`
        SELECT xp, level FROM user_levels WHERE guild_id = ? AND user_id = ?
    `).get(guildId, userId);

    if (!userRow) {
        db.prepare(`
            INSERT INTO user_levels (guild_id, user_id, xp, level) VALUES (?, ?, 0, 0)
        `).run(guildId, userId);
        userRow = { xp: 0, level: 0 };
    }

    // 2. Add random XP (15 to 25)
    const xpToAdd = Math.floor(Math.random() * 11) + 15;
    let newXp = userRow.xp + xpToAdd;
    let newLevel = userRow.level;
    const requiredXp = (newLevel + 1) * 100;

    // 3. Check for level up
    if (newXp >= requiredXp) {
        newLevel += 1;
        newXp -= requiredXp; // Carry over remaining XP
        message.channel.send(`🎉 Congratulations ${message.author}, you leveled up to **Level ${newLevel}**!`);
    }

    // 4. Save updated XP and level back to SQLite
    db.prepare(`
        UPDATE user_levels SET xp = ?, level = ? WHERE guild_id = ? AND user_id = ?
    `).run(newXp, newLevel, guildId, userId);
}