//api call on /task
const { SlashCommandBuilder } = require('discord.js');
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
            const body = {
                "task": interaction.options.getString('task'),
                "points": interaction.options.getInteger('points'),
                "total_spots": interaction.options.getInteger('total_spots'),
                "created_by": interaction.user.id,
            };
            axios.post('http://localhost:5000/task', body)
            .then(async (response) => {
                console.log(response.data)
                await interaction.reply({ embeds: [embedBuilder(response.data)] });
                // Create a new text channel
                interaction.guild.channels.create({ 
                    name: interaction.options.getString('channel_name'), 
                    reason: body.task,
                    parent: "1024940103040245811"
                })
                .then((output) => {console.log(output);return interaction.followUp(`Channel created for the task : ${output.toString()}`)})
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