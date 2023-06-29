const { Events, Client, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   * @param {Client} client
   * @returns {Promise<void>}
   */
  execute(client) {
    client.logger.info(`READY: Logged in as ${client.user.tag}.`);

    // Set the bot's status
    client.user.setPresence({
      status: 'online',
      activities: [
        {
          name: 'you',
          type: ActivityType.Watching
        }
      ]
    });
  }
};
