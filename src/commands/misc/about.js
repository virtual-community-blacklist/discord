const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const package = require('../../../package.json');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder().setName('about').setDescription('Shows information about VCB'),
  /**
   * @param {CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('About Creators Tavern Bot')
      .setDescription(
        'This bot was created by the VCB team and is FOSS [here](https://github.com/virtual-community-blacklist/discord)'
      )
      .addFields(
        {
          name: 'Node.js Version',
          value: process.version
        },
        {
          name: 'Discord.js Version',
          value: require('discord.js').version
        },
        {
          name: 'Bot Version',
          value: package.version
        },
        {
          name: 'Ram Usage',
          value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
        }
      )
      .setColor('#00BFFF');

    await interaction.reply({ embeds: [embed] });
  }
};
