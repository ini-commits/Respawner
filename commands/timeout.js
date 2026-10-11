import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Temporarily mute a member in the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member you want to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration of the timeout in minutes (1 to 40320)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(40320)) // 28 days
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the timeout')
                .setRequired(false))

        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // only people with mod perms
};