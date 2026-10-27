/**
 - Bot Architecture: Modular / Dynamic Command Loader
 - --------------------------------------------------
 - This file (index.js) acts as the controller. Instead of writing
 - every command in this file, it uses Node.js file system utilities (fs) and ESM path
 - resolution (__dirname) to automatically scan, import, and register any
 - .js file placed inside the 'commands/' directory.
 - We don't need to edit this file to add new commands.
 */

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, Events, GatewayIntentBits, REST, Routes, ActivityType } from 'discord.js';
import { handleLeveling } from './utils/leveling.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// load commands into a collection
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.default.data.name, command.default);
}

// when online, register commands with discord
client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Respawner is online! Logged in as ${readyClient.user.tag}`);

    readyClient.user.setPresence({
        activities: [{
            name: 'Respawn Sync on https://respawnsync.com',
            type: ActivityType.Listening,
        }],
        status: 'dnd',
    });

    const commandsData = client.commands.map(cmd => cmd.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        // register commands instantly
        await rest.put(
            Routes.applicationGuildCommands(readyClient.user.id, "1529097790062592040"),
            { body: commandsData }
        );
        console.log('Successfully registered guild slash commands.');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
});

// handle interactions (slash commands & modals)
client.on(Events.InteractionCreate, async (interaction) => {
    // handing modal submissions
    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('embed_')) {
            const command = client.commands.get('embed');
            if (command && command.handleModal) {
                await command.handleModal(interaction);
            }
        }
        return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

// autorole on join
client.on(Events.GuildMemberAdd, async (member) => {
    try {
        const roleId = '1529103788231626812';
        const role = member.guild.roles.cache.get(roleId);

        if (!role) {
            console.log(`Role with ID ${roleId} not found.`);
            return;
        }

        await member.roles.add(role);
        console.log(`Assigned ${role.name} role to ${member.user.tag}`);
    } catch (error) {
        console.error('Failed to assign role:', error);
    }
});

client.on(Events.MessageCreate, async (message) => {
    await handleLeveling(message);
});

client.login(process.env.DISCORD_TOKEN);