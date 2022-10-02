const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('add channel')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Specify the task which needs to be listed.')
                .setRequired(true)),
	async execute(interaction) {

        // Create a new text channel
        interaction.guild.channels.create({ 
            name: interaction.options.getString('name'), 
            reason: 'Needed a cool new channel',
            parent: "1024940103040245811"
         })
        .then((res)=> console.log(res.id))
        .catch(console.error);


        //edit add user to channel
        // interaction.guild.channels.edit('<#1024941015146172466>', { 
        //     permissionOverwrites: [
        //         { 
        //             id: interaction.user.id, 
        //             type: 1, 
        //             allow: PermissionsBitField.All,
        //          },
        //     ],
        //  })
        // .then(console.log("channel updated"))
        // .catch(console.error);

		interaction.reply(interaction.options.getString('name'));

	},
};