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
		const val = await output(id, email).then((res)=>{return res});
		console.log(val)
		// const {status,token, mssg} = await output(id,email);
		// if(status == "yes") return interaction.editReply("Already Verified");
		// if(status == "no_email_found"){
		// 	return interaction.editReply("You are a new user , kindly provide Email ID nex time !");
		// }
		// if(status == "no"){
		// 	//check for token
		// 	if(!input_token) return interaction.editReply(mssg+ "\n Provide token next time");
		// 	if(input_token == token){
		// 		return interaction.editReply("Verified");
		// 	} else {
		// 		return interaction.editReply("Token Mismatch");
		// 	}
		// }
		//if verified finish
	},
};



function output(id,email){
	try{
		return axios.get('http://localhost:5000/user/'+id)
		.then(async (response) => {
			let status ="no_email_found",token;
			let mssg;
			return new Promise((res,rej) => {
				if((response.data).length == 0){
					//if no user in records add user and then send data
					if(!email) return;
					mssg="System Identified you as new member and will add you to the database.\n Mail with a token will be sent \n";
					status="no";
					token= addUser(id, email);
				} else {
					//if user found send data
					res({
						status : response.data[0].verified,
						//console.log(status)
						token : response.data[0].verificationToken,
					});
					
				}
				
			})
			// if((response.data).length == 0){
			// 	//if no user in records add user and then send data
			// 	if(!email) return;
			// 	mssg="System Identified you as new member and will add you to the database.\n Mail with a token will be sent \n";
			// 	status="no";
			// 	token= await addUser(id, email);
			// } else {
			// 	//if user found send data
			// 	status = response.data[0].verified;
			// 	//console.log(status)
			// 	token = response.data[0].verificationToken;
			// } 
			//return {"status": status, "token": token, "message": mssg};
			//console.log(value);
		});
	} catch (error) {
		console.log(error);
	}
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