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

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const minutes = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (!target) {
            return interaction.reply({content: 'That user is not in this server.', ephemeral: true});
        }

        if (!target.moderatable) {
            return interaction.reply({
                content: 'I can\'t timeout this user. They may have a higher role than me.',
                ephemeral: true
            });
        }

        try {
            const durationMs = minutes * 60 * 1000;
            await target.timeout(durationMs, reason);

            const embed = new EmbedBuilder()
                .setTitle(`User has been timed out for ${minutes} minute(s)`)
                .setColor(0xFEE75C)
                .addFields(
                    { name: 'User', value: `${target.user.tag}`, inline: true },
                    { name: 'Duration', value: `${minutes} minute(s)`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setFooter({ text: `Action by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to timeout this user.', ephemeral: true });
        }
    },
};