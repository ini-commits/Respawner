import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
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

    const commandsData = client.commands.map(cmd => cmd.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        await rest.put(Routes.applicationCommands(readyClient.user.id), { body: commandsData });
        console.log('Successfully registered slash commands.');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
});

// handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
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

client.login(process.env.DISCORD_TOKEN);