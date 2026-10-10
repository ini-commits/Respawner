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
});

// authenticate and connect to Discord the bot token
client.login(process.env.DISCORD_TOKEN);