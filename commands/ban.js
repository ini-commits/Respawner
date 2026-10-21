import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import db from '../database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member you want to ban')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('permanent')
                .setDescription('Set to true for a permanent ban')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Duration of temp-ban in days (1 to 365)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(365))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const isPermanent = interaction.options.getBoolean('permanent') ?? false;
        const days = interaction.options.getInteger('days');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (!target) {
            return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
        }

        if (!isPermanent && !days) {
            return interaction.reply({
                content: 'Please either set `permanent` to true or specify a duration in `days`.',
                ephemeral: true
            });
        }

        if (!target.bannable) {
            return interaction.reply({
                content: 'I cannot ban this user. They may have a higher role than me or admin permissions.',
                ephemeral: true
            });
        }

        try {
            await target.ban({ reason, deleteMessageSeconds: 86400 });

            // save action to db
            try {
                const actionType = isPermanent ? 'BAN' : `TEMP-BAN (${days}d)`;
                const insertLog = db.prepare(`
                    INSERT INTO mod_logs (guild_id, user_id, moderator_id, action, reason) 
                    VALUES (?, ?, ?, ?, ?)
                `);
                insertLog.run(interaction.guild.id, target.id, interaction.user.id, actionType, reason);
            } catch (dbError) {
                console.error('Failed to save mod log to database:', dbError);
            }

            if (!isPermanent && days) {
                const durationMs = days * 24 * 60 * 60 * 1000;
                setTimeout(async () => {
                    try {
                        await interaction.guild.bans.remove(target.id, 'Temp-ban duration expired');
                    } catch (unbanError) {
                        console.error(`Failed to unban ${target.id}:`, unbanError);
                    }
                }, durationMs);
            }

            const durationText = isPermanent ? 'Permanently' : `${days} day(s)`;

            const embed = new EmbedBuilder()
                .setTitle(`User Has Been Banned`)
                .setColor(0xED4245)
                .addFields(
                    { name: 'User', value: `${target.user.tag}`, inline: true },
                    { name: 'Duration', value: durationText, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setFooter({ text: `Action by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to ban this user.', ephemeral: true });
        }
    },
};