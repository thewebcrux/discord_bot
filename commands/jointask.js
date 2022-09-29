const { SlashCommandBuilder } = require('discord.js');
const {ActionRowBuilder, SelectMenuBuilder} = require('discord.js');
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
        const filter = i => {
            return i.user.id === interaction.user.id && i.customId === 'join_task';
        };

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
        collector.on('collect', async i => {
            //close collector 
            collector.stop();
            //Joining Starts
            await i.deferReply();
            
            //fecth specific task >> check TL post >> 
            //fetch specific user >>check eliblity for TL>>
            //
            await i.editReply({ content: `${i.values} was chosen.. `, components: [] });
        });
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
            interaction.deleteReply();
        });
        
	},
};


function selectMenuCreator(raw_data){

    const optionArray = [];
    let task_leader;
    // adding option in select menu        
    raw_data.forEach(element => {
        task_leader = element.task_leader.toString()
        optionArray.push({
            label: element.task,
            description: `Points: ${element.points}   Spots Left: ${element.spots_left}  \n Total Spots: ${element.total_spots}   Task Leader: <@${task_leader}>`,
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