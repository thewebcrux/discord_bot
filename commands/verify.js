const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Sends Verification Mail'),
	async execute(interaction) {
		return interaction.reply('Mail Sent !');
	},
};