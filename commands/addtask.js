//api call on /task
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtask')
		.setDescription('Used for adding task by providing required parameters')
        .addStringOption(option =>
            option.setName('task')
                .setDescription('Specify the task which needs to be listed.')
                .setRequired(true))
        .addIntegerOption(option =>
             option.setName('points')
                .setDescription('Points to be rewarded upon completion')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('total_spots')
                .setDescription('How many people can join this task including task leader ?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('channel_name')
                .setDescription('Name of channel where task related discussions will be held')
                .setRequired(true)),        
    

	async execute(interaction) {
        try {
            await interaction.deferReply();
            let channelID;
            // Create a new text channel
            await interaction.guild.channels.create({ 
                name: interaction.options.getString('channel_name'), 
                reason: interaction.options.getString('task'),
                parent: "1026752094675411014"
            })
            .then((output) => {channelID = output.id;return interaction.followUp(`Channel created for the task : <#${output.id}>`)})
            .catch(console.error);
            
            const body = {
                "task": interaction.options.getString('task'),
                "points": interaction.options.getInteger('points'),
                "total_spots": interaction.options.getInteger('total_spots'),
                "created_by": interaction.user.id,
                "channelID": channelID,
            };


            axios.post('http://localhost:5000/task', body)
            .then(async (response) => {
                console.log(response.data)
                await interaction.editReply({ embeds: [embedBuilder(response.data)] });
                
                //add channel
                //edit add user to channel
                interaction.guild.channels.edit(channelID, { 
                    permissionOverwrites: [
                        { 
                            id: interaction.user.id, 
                            type: 1, 
                            allow: PermissionsBitField.All,
                        },
                    ],
                })
                .then(()=>{return interaction.followUp("Task is listed !")})
                .catch(console.error);

            }, (error) => {
                console.log(error);
                return interaction.reply('Error');
            });
        } catch (error) {
            console.log(error);
            interaction.reply("Error");
        }
		
	},
};



function embedBuilder(raw_data){
    const task_embed = new EmbedBuilder()
	.setColor(0x83F683)
	.setTitle('Task Add')
	.setTimestamp();
    raw_data.forEach(element => {
        task_embed.addFields({ name: "Status : "+element.status, value: element.message});
    });
    return task_embed;
}