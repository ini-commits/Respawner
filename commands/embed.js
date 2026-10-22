import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ModalBuilder,
    TextInputBuilder, TextInputStyle, ActionRowBuilder} from 'discord.js';
import db from '../database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create, save, and send custom server embeds')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand(sub =>
            sub.setName('create')
                .setDescription('Open a form to create and save a new custom embed')
                .addStringOption(opt =>
                    opt.setName('name')
                        .setDescription('A unique name to reference this embed later')
                        .setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('send')
                .setDescription('Send a previously saved embed')
                .addStringOption(opt =>
                    opt.setName('name')
                        .setDescription('The name of the saved embed')
                        .setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('List all saved embeds in this server')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        // sub command to open modal
        if (subcommand === 'create') {
            const name = interaction.options.getString('name');

            const modal = new ModalBuilder()
                .setCustomId(`embed_create_${name}`)
                .setTitle(`Configure Embed: ${name}`);

            const titleInput = new TextInputBuilder()
                .setCustomId('embed_title')
                .setLabel('Embed Title')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const descInput = new TextInputBuilder()
                .setCustomId('embed_description')
                .setLabel('Description (supports Discord markdown)')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const colorInput = new TextInputBuilder()
                .setCustomId('embed_color')
                .setLabel('Hex Color (e.g. #ffffff)')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('#0099ff')
                .setRequired(false);

            const authorInput = new TextInputBuilder()
                .setCustomId('embed_author')
                .setLabel('Author Name')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            modal.addComponents(
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(descInput),
                new ActionRowBuilder().addComponents(colorInput),
                new ActionRowBuilder().addComponents(authorInput)
            );

            await interaction.showModal(modal);
        }

        // sending sub command
        else if (subcommand === 'send') {
            const name = interaction.options.getString('name');

            const savedEmbed = db.prepare(`
                SELECT * FROM custom_embeds WHERE guild_id = ? AND name = ?
            `).get(interaction.guild.id, name);

            if (!savedEmbed) {
                return interaction.reply({
                    content: `No saved embed found with the name **${name}**.`,
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setDescription(savedEmbed.description);

            if (savedEmbed.title) embed.setTitle(savedEmbed.title);
            if (savedEmbed.color) embed.setColor(savedEmbed.color);
            if (savedEmbed.author) embed.setAuthor({ name: savedEmbed.author });
            embed.setTimestamp();

            await interaction.channel.send({ embeds: [embed] });
            await interaction.reply({ content: `Successfully sent embed **${name}**!`, ephemeral: true });
        }

        // listing sub command
        else if (subcommand === 'list') {
            const embeds = db.prepare(`
                SELECT name FROM custom_embeds WHERE guild_id = ?
            `).all(interaction.guild.id);

            if (embeds.length === 0) {
                return interaction.reply({ content: 'There are no saved embeds in this server yet.', ephemeral: true });
            }

            const listString = embeds.map(e => `• \`${e.name}\``).join('\n');

            const listEmbed = new EmbedBuilder()
                .setTitle('Saved Server Embeds')
                .setDescription(listString)
                .setColor(0x0099ff);

            await interaction.reply({ embeds: [listEmbed], ephemeral: true });
        }
    }

