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

        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (!target) {
            return interaction.reply({content: "That user is not in this server.", ephemeral: true});
        }

        if (!target.moderatable) {
            return interaction.reply({
                content: "I can\'t kick this user. They may have a higher role than me",
                ephemeral: true
            });
        }

    }
}