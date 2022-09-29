//api call on /task
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder , ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const axios = require('axios');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tasklist')
		.setDescription('Lists down all tasks'),
	async execute(interaction) {
        await interaction.deferReply();
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('join_task')
					.setLabel('Join Task')
					.setStyle(ButtonStyle.Primary),
		);
        try {
            axios.get('http://localhost:5000/task')
            .then((response) => {
                return interaction.editReply({ embeds: [embedBuilder(response.data)], components: [row] });
            }, (error) => {
                console.log(error);
                return interaction.editReply('Error');
            });
        } catch (error) {
            console.log(error);
            return interaction.editReply("Error");
        }

        //button handling
        const filter = i => i.customId === 'join_task' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        collector.on('collect', async i => {
            await i.reply({ content: 'A button was clicked!', components: [] });
        });
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
		
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
                               value: "Points : **"+element.points+"** Spots left : **"+element.spots_left+"** Created by : **<@"+element.created_by+">**"});
    });
    return task_embed;
}