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

