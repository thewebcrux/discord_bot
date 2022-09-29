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

		try {

			const data = await fetchData(id, email).then((res)=>{return res}).catch((error)=>{throw error});
			const status = data.status, token = data.token, mssg = data.mssg;

			if(status == "yes") return interaction.editReply("Already Verified");
			if(status == "no_email_found"){
				return interaction.editReply("You are a new user , kindly provide Email ID next time !");
			}
			if(status == "no"){
				//check for token
				if(!token) return interaction.editReply(mssg+ "Check Mail for further instructions");
				if(!input_token) return interaction.editReply(mssg+ "\n Provide token next time");
				if(input_token == token){
					//update verificationStatus
					return await updateVerificationStatus(id)
					.then((response) => interaction.editReply("Result : "+response))
					.catch((err) => interaction.editReply("error : "+err))
				} else {
					return interaction.editReply("Token Mismatch");
				}
			}

		} catch (error) {
			console.log("ye waala "+error)
			interaction.editReply("Error Contact Dev");
		}

	},
};



function fetchData(id,email){
	try{
		return axios.get('http://localhost:5000/user/'+id)
		.then(async (response) => {
			return new Promise((res,rej) => {
				if((response.data).length == 0){
					//if no user in records add user and then send data

					//if no email for adding ffoound
					if(!email) return res({
						status : "no_email_found",
						//console.log(status)
						token : "",
						mssg : "",
					});

					//adding
					try {
						addUser(id, email)
						.then((genToken) => {
							sendMail(email, genToken).then((mssg)=>{
								res({
									status : "no",
									token : "",
									mssg : mssg,	
								})
							}).catch((err) => rej(console.log("Mail sending error : "+err)))
							
						}).catch((err) => rej(console.log("User adding error : "+err)));
					} catch (error) {
						rej(console.log("User Adding error here : "+error))
					}
				} else {
					//if user found send data
						res({
							status : response.data[0].verified,
							token : response.data[0].verificationToken,
							mssg : "",	
						})
				}
			})
		});
	} catch (error) {
		console.log("here"+error);
	}
}
	
function addUser(id, email){
	return new Promise((res,rej)=>{
		const token = tokenGenerator(id);
		try {
			const body = {
				"id": ""+id,
				"token": token,
				"email": email,
			};
			axios.post('http://localhost:5000/user', body)
			.then((response) => {
				console.log(response.data)
				if(response.data[0].status == "ok"){
					res(token);
				} else {
					rej("Error Adding User");
				}
			}, (error) => {
				console.log(error);
			});
		} catch (error) {
			console.log(error);
			rej(error)
		}
	});
}

function tokenGenerator(id){
	return id;
}

function updateVerificationStatus(id){
	return new Promise((res,rej) => {
		try {
			axios.put('http://localhost:5000/user/'+id)
			.then((response) => {
				res(response.data[0].message)
			}, (error) => {
				rej(error)
			});
		} catch (error) {
			console.log(error);
			rej(error)
		}
	})
}


function sendMail(mail,token){
	const transporter = require("../mailer.js");
	return new Promise((resolve,reject) => {
		var mailOptions = {
			from: 'thewebcrux@gmail.com',
			to: mail,
			subject: 'Webcrux user verification',
			text: `Your token for verification is ${token} \n You can now go back to channel and use /verify command with [token] option and paste it there. \n Thank You, \n Team Webcrux`
		};
		
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				resolve(" Mail with token is sent to your mail ID (if its a real id): "+mail);
				console.log('Email sent: ' + info.response);
			}
		});

	});
}