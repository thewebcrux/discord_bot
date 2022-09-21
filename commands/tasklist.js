//api call on /task
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tasklist')
		.setDescription('Lists down all tasks'),
	async execute(interaction) {
        axios.get('http://localhost:5000/task')
          .then((response) => {
            return interaction.reply(response.data);
          }, (error) => {
            console.log(error);
            return interaction.reply('Error');
          });
		
	},
};