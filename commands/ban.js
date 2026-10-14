import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

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
                .setDescription('Set to true for a permanent ban (overrides duration)')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Duration of the temp-ban in days (1 to 365)')
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
            await target.ban({ reason });

            if (!isPermanent && days) {
                const durationMs = days * 24 * 60 * 60 * 1000;
                setTimeout(async () => {
                    try {
                        await interaction.guild.bans.remove(target.id, 'Temporary ban duration expired');
                    } catch (unbanError) {
                        console.error(`Failed to automatically unban user ${target.id}:`, unbanError);
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