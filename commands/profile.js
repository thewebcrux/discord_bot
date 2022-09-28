const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Shows your profile stats'),
	async execute(interaction) {
        await interaction.deferReply();
        interaction.editReply("Here is your profile");
        interaction.followUp("lmao");
	},
};