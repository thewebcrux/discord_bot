const { SlashCommandBuilder } = require('discord.js');
const {ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jointask')
		.setDescription('Helps you choose and join selected task !'),
	async execute(interaction) {
		await interaction.deferReply();

        //api fetch all data
        try {
            axios.get('http://localhost:5000/task')
            .then((response) => {
                //send api data to slect menu builder function and returns its menu to interaction reply
                return interaction.editReply({ components: [selectMenuCreator(response.data)] });
            }, (error) => {
                console.log(error);
                return interaction.editReply('Error');
            });
        } catch (error) {
            console.log(error);
            return interaction.editReply("Error");
        }

        //selectmenu event handler
        const filter = i => i.customId === 'join_task' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
        collector.on('collect', async i => {
            await i.reply({ content: `${i.values} was chosen.. `, components: [] });
        });
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};


function selectMenuCreator(raw_data){

    const optionArray = [];
    // adding option in select menu        
    raw_data.forEach(element => {
        optionArray.push({
            label: element.task,
            description: `Points: ${element.points}   Spots Left: ${element.spots_left}   Total Spots: ${element.total_spots}`,
            value: element.taskID+"",
        })
    });      
    console.log(optionArray)
    //select menu init
    const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
                .setCustomId('join_task')
                .setPlaceholder('Select the task you want to join')
                .setOptions(optionArray)
            );

    return row;
}