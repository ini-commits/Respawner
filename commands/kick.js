import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member from the server")
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The member you want to kick")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription('The reason for the kick')
                .setRequired(false))

        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
}