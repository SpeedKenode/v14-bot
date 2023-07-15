const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency'),

	async execute(interaction) {
		await interaction.deferReply();
	  	const reply = await interaction.fetchReply();
	  	const ping = reply.createdTimestamp - interaction.createdTimestamp;

		const embed = new EmbedBuilder()
			.setColor("#06016b")
			.setDescription(`:ping_pong: Pong! Client ${ping}ms`)

		await interaction.editReply({ embeds: [embed] });
	},
};