const { SlashCommandBuilder } = require('discord.js');
// Refer: https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};