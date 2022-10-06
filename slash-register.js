const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('./.config.json');

const commands = [];
const globalCommands =[];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	let cmd;
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	cmd = command.data.toJSON()
	commands.push(cmd);
	
	foo: if(cmd.name == "connect" || cmd.name == "channel" || cmd.name == "tasklist") {
		break foo
	} else {
		globalCommands.push(cmd)
	}

}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

rest.put(
	Routes.applicationCommands(clientId),
	{ body: globalCommands },
).then(()=>{
	console.log('Successfully registered application commands to global')
});	