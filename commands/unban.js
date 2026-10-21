import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import db from '../database.js';

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

    async execute(interaction) {
        const targetId = interaction.options.getString('target_id');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        try {
            // check if user is actually banned
            const banInfo = await interaction.guild.bans.fetch(targetId).catch(() => null);

            if (!banInfo) {
                return interaction.reply({
                    content: 'This user is not banned or the provided User ID is invalid.',
                    ephemeral: true
                });
            }

            await interaction.guild.bans.remove(targetId, reason);

            // save action to db
            try {
                const insertLog = db.prepare(`
                    INSERT INTO mod_logs (guild_id, user_id, moderator_id, action, reason) 
                    VALUES (?, ?, ?, ?, ?)
                `);
                insertLog.run(interaction.guild.id, targetId, interaction.user.id, 'UNBAN', reason);
            } catch (dbError) {
                console.error('Failed to save mod log to database:', dbError);
            }

            const embed = new EmbedBuilder()
                .setTitle('User Has Been Unbanned')
                .setColor(0x57F287)
                .addFields(
                    { name: 'User', value: `${banInfo.user.tag} (\`${banInfo.user.id}\`)`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setFooter({ text: `Action by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to unban user:', error);
            await interaction.reply({
                content: 'There was an error trying to unban this user.',
                ephemeral: true
            });
        }
    },
};