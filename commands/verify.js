const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Sends Verification Mail')
		.addStringOption(option =>
            option.setName('email')
                .setDescription('Specify the email ID where you will get the token !')
                .setRequired(false))
		.addStringOption(option =>
			option.setName('token')
				.setDescription('Dont use this unless you have got your token on email ID')
				.setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply();
		const id = interaction.user.id;
		const input_token = interaction.options.getString("token");
		const email = interaction.options.getString("email");
		const {status,token} = await getUserVerificationStatus(id, email);
		
		//if verified finish
	},
};

function getUserVerificationStatus(id, email){
	let status ="",token = "";
	let mssg = "";
	try{
		axios.get('http://localhost:5000/user/'+id)
		.then((response) => {
			if((response.data).length == 0){
				//if no user in records add user and then send data
				if(!email) return;
				mssg="System Identified you as new member and will add you to the database.\n Mail with a token will be sent \n";
				status="no";
				token= addUser(id, email);
			} else {
				//if user found send data
				status = response.data.verified;
				token = response.data.verificationToken;
			} 
		}, (error) => {
			console.log(error);
		});
	} catch (error) {
		console.log(error);
	}
	return {"status": status, "token": token, "message": mssg};
}	

function addUser(id, email){
	const token = tokenGenerator(id);
	try {
		const body = {
			"id": id,
			"token": token,
			"email": email,
		};
		axios.post('http://localhost:5000/user', body)
		.then((response) => {
			console.log(response.data)
		}, (error) => {
			console.log(error);
		});
	} catch (error) {
		console.log(error);
	}
	return token;
}

function tokenGenerator(id){
	return id;
}