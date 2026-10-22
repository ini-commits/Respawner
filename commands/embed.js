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

