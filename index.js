import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// we run this once when client is ready
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Respawner is online! Logged in as ${readyClient.user.tag}`);
});

// listening for messages in channels the bot can see
client.on(Events.MessageCreate, (message) => {
    // ignoring messages sent by bots
    if (message.author.bot) return;

    // test command
    if (message.content === '!respawn-ping') {
        message.reply('Respawner is online!');
    }

    // --- TEMPORARY TEST TRIGGER ---
    if (message.content === '!test-join') {
        client.emit('guildMemberAdd', message.member);
        message.reply('Simulated a new member join for you! Check your roles.');
    }
});

// auto role assign when someone joins
client.on(Events.GuildMemberAdd, async (member) => {
    try {
        const role = member.guild.roles.cache.find((r) => r.name === 'Member');

        if (!role) {
            console.log('Role "Member" not found in this server.');
            return;
        }

        // assigning the role
        await member.roles.add(role);
        console.log(`Successfully assigned the ${role.name} role to ${member.user.tag}`);
    } catch (error) {
        console.error('Failed to assign role:', error);
    }
});

// authenticate and connect to Discord the bot token
client.login(process.env.DISCORD_TOKEN);