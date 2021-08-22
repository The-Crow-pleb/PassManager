//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

require('dotenv').config();
const {Client, Intents} = require('discord.js')
const client = new Client({disableMentions: "everyone",partials: ["CHANNEL"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING]});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

const { registerCommands, registerEvents } = require('./util/registry/registry');
(async () => {
    client.login(process.env.BOT_TOKEN); client.commands = new Map()
    await registerEvents(client, '../../events/discordEvents'); await registerCommands(client, '../../commands');
})();

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//