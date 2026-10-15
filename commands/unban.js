import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server using their User ID.')
        .addStringOption(option =>
            option.setName('target_id')
                .setDescription('The ID of the user you want to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the unban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
}