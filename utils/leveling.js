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