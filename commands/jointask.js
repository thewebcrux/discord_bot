const { SlashCommandBuilder, ButtonStyle } = require('discord.js');
const {ActionRowBuilder, SelectMenuBuilder, ButtonBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jointask')
		.setDescription('Helps you choose and join selected task !'),
	async execute(interaction) {
		await interaction.deferReply();

        let taskCache;
        let selectMenu;
        //api fetch all data
        try {
            axios.get('http://localhost:5000/task')
            .then((response) => {
                //send api data to slect menu builder function and returns its menu to interaction reply
                [selectMenu,taskCache] = selectMenuCreator(response.data);
                return interaction.editReply({ components: [selectMenu] });
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
            try {
                //fecth specific task >> check TL post >>
                const taskID = i.values;
                const tl_status = taskCache.get(taskID+"");
                const userID = i.user.id
                
                //fetch specific user >>check eliblity for TL>>
                let userData;
                await fetchUserData(userID)
                        .then((response)=>{userData = response})
                        .catch((err) => {throw err});
                
                if(tl_status == "EMPTY"){
                    if(userData.tasks_finished > 3){
                        //ask for tl post
                        const buttons = choice();
                        i.editReply({ content: "Do you want to be task leader for this task ?", components: [buttons] })
                    }
                } else {
                    interaction.deleteReply();
                    i.editReply("no task leader for you")
                }

                //send final reply
                //return i.editReply(`TL status of task ID : ${taskID} is ${tl_status}`)
            } catch (error) {
                console.log(error)
                i.editReply("Error Occured : "+error);
            }
        });
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });
        
	},
};


function selectMenuCreator(raw_data){

    const optionArray = [];
    const taskCache = new Map();
    let status;
    const task_leader = (position) => {
        if(position == 0){
            return "EMPTY";
        } else {
            return "FILLED"
        }
    }
    // adding option in select menu        
    raw_data.forEach(element => {
        status = task_leader(element.task_leader);
        taskCache.set(element.taskID+"", status);
        optionArray.push({
            label: element.task,
            description: `Points : ${element.points} ,   Spots Left : ${element.spots_left} ,  Total Spots : ${element.total_spots} ,   TL Spot : ${status}`,
            value: element.taskID+"",
        })
    });      
    //console.log(optionArray)
    //select menu init
    const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
                .setCustomId('join_task')
                .setPlaceholder('Select the task you want to join')
                .setOptions(optionArray)
            );

    return [row, taskCache];
}

function fetchUserData(userID){
    return new Promise((resolve,reject)=>{
        try {
            axios.get('http://localhost:5000/user/'+userID)
            .then((response) => {
                if((response.data).length == 0) reject("You are a new user, use ```/verify```")
                resolve(response.data[0])   
            }, (error) => {
                console.log(error);
                reject(error)
            });
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}


function choice(){
    const yesButton = new ButtonBuilder()
                            .setCustomId('yes')
                            .setLabel('YES')
                            .setStyle(ButtonStyle.Primary);
    const noButton = new ButtonBuilder()
                            .setCustomId('no')
                            .setLabel('NO')
                            .setStyle(ButtonStyle.Primary);                        
    const row = new ActionRowBuilder()
			.addComponents(
                [yesButton,noButton]
            );
    return row;        
}