const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Shows your profile stats'),
	async execute(interaction) {
        await interaction.deferReply();
        
        //fetch all user data
        const userData = () => {
            return new Promise((resolve,reject)=>{
                try {
                    axios.get('http://localhost:5000/user/'+interaction.user.id)
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
            });
        }

        let rawData,error;
        await userData()
                .then((res)=> {rawData = res})
                .catch((err)=>{console.log(err); error=err})
        if(!rawData) return interaction.followUp("Error : "+error)        
        console.log(rawData)

        //call embedbuilder on all fetched data
        const embed = embedBuilder(rawData,interaction.user);

        //send embed
        interaction.editReply({embeds: [embed]});
	},
};


function embedBuilder(raw_data, requestor_data){
    const task_embed = new EmbedBuilder()
	.setColor(0x07CB15)
	.setAuthor({
        name: requestor_data.username,
        iconURL: "https://cdn.discordapp.com/attachments/964921138406899796/969217414736785428/Desktop_-_7.png"
    })
    .setTitle("Profile Stats : ")
	.setTimestamp()
    .setThumbnail(`https://cdn.discordapp.com/avatars/${requestor_data.id}/${requestor_data.avatar}.png`)
	.setFooter({ text: 'What do i write here ?', iconURL: 'https://cdn.discordapp.com/icons/976369125171556362/5a41a61c15d5e32cd37796ad4382e085.png?size=1024' });

    task_embed.addFields({
        name: "Profile Verified", value: `${raw_data.verified}`, inline: true
     },{
        name: "Tasks Enrolled", value: `${raw_data.tasks_enrolled}`, inline: true
     },{
        name: "Tasks Finished", value: `${raw_data.tasks_finished}`, inline: true
     },{
        name: "Points Earned", value: `${raw_data.points_earned}`, inline: true
     },{
        name: "No. of times Task Leader", value: `${raw_data.no_of_times_task_leader}`, inline: true
     },{
        name: "Registered Mail ID", value: `${raw_data.email}`, inline: true
     });
    return task_embed;
}
