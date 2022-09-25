const { SlashCommandBuilder } = require('discord.js');
const detectEthereumProvider = require('@metamask/detect-provider');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect')
		.setDescription('Connecting metamask wallet with webcrux'),
	async execute(interaction) {
		// This function detects most providers injected at window.ethereum
        const provider = await detectEthereumProvider();
        if (provider) {
        // From now on, this should always be true:
        // provider === window.ethereum
        console.log(provider); // initialize your app
        } else {
        interaction.reply('Please install MetaMask!');
        }

	},
};