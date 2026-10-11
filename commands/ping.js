import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('respawn-ping')
        .setDescription('Check if Respawner is online!'),
    async execute(interaction) {
        await interaction.reply('Respawner is online!');
    },
};