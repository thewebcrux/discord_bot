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
                .setRequired(true)),
    

	async execute(interaction) {
        try {
            const body = {
                "task": interaction.options.getString('task'),
                "points": interaction.options.getInteger('points'),
                "total_spots": interaction.options.getInteger('total_spots'),
                "created_by": `<@${interaction.user.id}>`,

            };
            axios.post('http://localhost:5000/task', body)
            .then((response) => {
                console.log(response.data)
                return interaction.reply({ embeds: [embedBuilder(response.data)] });
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