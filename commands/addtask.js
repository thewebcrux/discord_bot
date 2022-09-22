//api call on /task
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtask')
		.setDescription('Used for adding task by providing required parameters'),
	async execute(interaction) {
        try {
            axios.post('http://localhost:5000/task')
            .then((response) => {
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
	.setColor(0x0099FF)
	.setTitle('Task List')
	.setTimestamp()
	.setFooter({ text: 'Task display limit (limit 10)', iconURL: 'https://cdn.discordapp.com/icons/976369125171556362/5a41a61c15d5e32cd37796ad4382e085.png?size=1024' });

    raw_data.forEach(element => {
        task_embed.addFields({ name: ""+element.taskID+":  "+element.task,
                               value: "Points : **"+element.points+"** Spots left : **"+element.spots_left+"** Created by : **"+element.created_by+"**"});
    });
    return task_embed;
}