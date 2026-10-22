import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import db from '../database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rulesembed')
        .setDescription('Send the custom embed for the server rules')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

    async execute(interaction) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('SERVER RULES')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'reubqn', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        channel.send({ embeds: [exampleEmbed] });
    }
}