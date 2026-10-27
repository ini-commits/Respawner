import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const levelsFile = path.join(__dirname, '../levels.json');
const cooldowns = new Set();

function getLevelsData() {
    if (!fs.existsSync(levelsFile)) fs.writeFileSync(levelsFile, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(levelsFile, 'utf8'));
}

function saveLevelsData(data) {
    fs.writeFileSync(levelsFile, JSON.stringify(data, null, 2));
}

export async function handleLeveling(message) {
    if (message.author.bot || !message.guild) return;

    const userId = message.author.id;
    const guildId = message.guild.id;
    const cooldownKey = `${guildId}-${userId}`;

    if (cooldowns.has(cooldownKey)) return;
    cooldowns.add(cooldownKey);
    setTimeout(() => cooldowns.delete(cooldownKey), 60000);

    const data = getLevelsData();
    if (!data[guildId]) data[guildId] = {};
    if (!data[guildId][userId]) data[guildId][userId] = { xp: 0, level: 0 };

    const xpToAdd = Math.floor(Math.random() * 11) + 15;
    data[guildId][userId].xp += xpToAdd;

    const current = data[guildId][userId];
    const requiredXp = (current.level + 1) * 100;

    if (current.xp >= requiredXp) {
        current.level += 1;
        current.xp -= requiredXp;
        message.channel.send(`🎉 Congratulations ${message.author}, you leveled up to **Level ${current.level}**!`);
    }

    saveLevelsData(data);
}