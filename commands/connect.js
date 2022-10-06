const { SlashCommandBuilder } = require('discord.js');
const detectEthereumProvider = require('@metamask/detect-provider');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect')
		.setDescription('Connecting metamask wallet with webcrux'),
	async execute(interaction) {
		// This function detects most providers injected at window.ethereum
        let roles;
        await interaction.guild.members.fetch('612273757637181462').then((res)=>{ 
            roles = res.roles.cache 
        })
        roles.forEach(rolesCache => {
            console.log(rolesCache.id)
            console.log("2nd")
        });
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