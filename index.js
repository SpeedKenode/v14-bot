require("dotenv").config()
const { token } = process.env;
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const { loadEvents } = require('./handlers/event');
const { loadCommands } = require('./handlers/command');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.MessageContent, 
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	] });

client.commands = new Collection();

client.login(token).then(() => {
	loadCommands(client);
	loadEvents(client);
}).catch((err) => console.log(err));