// Requires
require('dotenv/config');

const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const config = require('../config.json');
const path = require('node:path');
const logger = require('logger');
const utils = require('./util');
const fs = require('node:fs');

const { clientId, guildId, token } = config;

process.setUncaughtExceptionCaptureCallback((err) => {
  logger.error(err);
});

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN ?? token);

// Client variables
client.commands = new Collection();
client.contextMenus = new Collection();
client.commandsLocationMapping = new Collection();
client.events = new Collection();
client.logger = logger;
client.config = config;
client.utils = utils;
client.database = utils.database;
// Commands
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // if the file has a _ in front of it, its disabled and should not be loaded
    if (file.startsWith('_')) {
      logger.warning(`The command at ${filePath} is disabled and will not be loaded.`);
      continue;
    }

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      client.commandsLocationMapping.set(command.data.name, folder);
      commands.push(command.data.toJSON());
      logger.info(`Loaded command ${command.data.name}`);
    } else {
      logger.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Context Menus
const contextMenuPath = path.join(__dirname, 'commands', 'contextmenus');
const contextMenuFiles = fs.readdirSync(contextMenuPath).filter((file) => file.endsWith('.js'));

for (const file of contextMenuFiles) {
  const filePath = path.join(contextMenuPath, file);
  const contextMenu = require(filePath);

  // if the file has a _ in front of it, its disabled and should not be loaded
  if (file.startsWith('_')) {
    logger.warning(`The context menu at ${filePath} is disabled and will not be loaded.`);
    continue;
  }

  if ('data' in contextMenu && 'execute' in contextMenu) {
    client.contextMenus.set(contextMenu.data.name, contextMenu);
    logger.info(`Loaded context menu ${contextMenu.data.name}`);
  } else {
    logger.warning(`The context menu at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    // If the event is a once event
    client.once(event.name, (...args) => event.execute(...args));
    logger.info(`Loaded once event ${event.name}`);
  } else {
    // If the event is a normal event
    client.on(event.name, (...args) => event.execute(...args));
    logger.info(`Loaded event ${event.name}`);
  }
}

(async () => {
  try {
    logger.info('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.warning('Failed to reload application (/) commands.');
    logger.warning(error);
  }
})();

// Login
client.login(process.env.DISCORD_TOKEN ?? token);
