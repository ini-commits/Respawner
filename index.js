import 'dotenv/config';
import { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// run when client is ready
client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Respawner is online! Logged in as ${readyClient.user.tag}`);

    // automatically register the slash command on startup
    const commands = [
        new SlashCommandBuilder()
            .setName('respawn-ping')
            .setDescription('Check if Respawner is online!')
            .toJSON(),
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        // registers commands globally, btw lobal commands can take up to an hour to appear across discord
        await rest.put(
            Routes.applicationCommands(readyClient.user.id),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Failed to register slash commands:', error);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'respawn-ping') {
        await interaction.reply('Respawner is online!');
    }
});

// auto role assign
client.on(Events.GuildMemberAdd, async (member) => {
    try {
        const roleId = '1529103788231626812';
        const role = member.guild.roles.cache.get(roleId);

        if (!role) {
            console.log(`Role with ID ${roleId} not found in this server.`);
            return;
        }

        await member.roles.add(role);
        console.log(`Successfully assigned the ${role.name} role to ${member.user.tag}`);
    } catch (error) {
        console.error('Failed to assign role:', error);
    }
});

// authenticate and connect to discord using the bot token
client.login(process.env.DISCORD_TOKEN);