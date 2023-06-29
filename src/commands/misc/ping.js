const { SlashCommandBuilder, EmbedBuilder, CommandInteraction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription("Shows the bot's ping"),
  /**
   * @param {CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const embed = new EmbedBuilder().setTitle('Ping?').setDescription('Pinging... Please wait...').setColor('#00BFFF');
    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    const ping = msg.createdTimestamp - interaction.createdTimestamp;
    embed.setDescription(`Latency is ${ping}ms\nAPI Latency is ${Math.round(interaction.client.ws.ping)}ms`);
    embed.setTitle(':ping_pong: Pong!');

    await msg.edit({ embeds: [embed] });
  }
};
