import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import db from '../database.js';

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
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (!target) {
            return interaction.reply({ content: "That user is not in this server.", ephemeral: true });
        }

        if (!target.kickable) {
            return interaction.reply({
                content: "I can't kick this user. They may have a higher role than me",
                ephemeral: true
            });
        }

        try {
            await target.kick(reason);

            // save action to db
            try {
                const insertLog = db.prepare(`
                    INSERT INTO mod_logs (guild_id, user_id, moderator_id, action, reason) 
                    VALUES (?, ?, ?, ?, ?)
                `);
                insertLog.run(interaction.guild.id, target.id, interaction.user.id, 'KICK', reason);
            } catch (dbError) {
                console.error('Failed to save mod log to database:', dbError);
            }

            const embed = new EmbedBuilder()
                .setTitle('User has been kicked from the server')
                .setColor(0xFEE75C)
                .addFields(
                    { name: 'User', value: `${target.user.tag}`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setFooter({ text: `Action by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            await interaction.reply({ content: 'There was an error trying to kick this user', ephemeral: true });
        }
    }
};