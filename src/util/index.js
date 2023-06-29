const nanoid = require('nanoid');
const parser = require('any-date-parser');
const { IANAZone } = require('luxon');

async function genRandomId(len) {
  return nanoid.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', len)();
}

function getThreadById(client, threadId) {
  const guild = client.guilds.cache.get(client.config.guildId);
  const threadChannels = guild.channels.cache.filter((c) => c.isThread());

  return threadChannels.find((c) => c.id === threadId);
}

module.exports.genRandomId = genRandomId;
module.exports.getThreadById = getThreadById;
module.exports.database = require('./database');
