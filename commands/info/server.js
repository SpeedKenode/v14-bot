const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Get information about the server"),

	async execute(interaction) {
		const { guild } = interaction;
		const { members, ownerId, createdTimestamp, emojis, stickers, channels, roles } = guild;
		const sortRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
		const userRoles = sortRoles.filter(role => !role.managed);
		const botCount = members.cache.filter(member => member.user.bot).size;
		const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
		const totalChannels = getChannelTypeSize([
				ChannelType.GuildText,
				ChannelType.GuildVoice,
				ChannelType.GuildStageVoice,
				ChannelType.GuildForum
		])


		let baseVerification = guild.verificationLevel;
		switch (baseVerification) {
			case 0:
				baseVerification = "None"
				break;
			
			case 1:
				baseVerification = "Low"
				break;

			case 2:
				baseVerification = "Medium"
				break;

			case 3:
				baseVerification = "High"
				break;

			case 4:
				baseVerification = "Very High"
				break;
		}

		const embed = new EmbedBuilder()
			.setColor("#06016b")
			.setThumbnail(guild.iconURL())
			.setAuthor({ name: `Information about ${guild.name}`, iconURL: guild.iconURL() })
			.addFields(
				{ name: `:crown: Owner`, value: `<@${ownerId}>`, inline: true },
				{ name: `:calendar_spiral: Date created`, value: `<t:${parseInt(createdTimestamp / 1000)}:R>`, inline: true },
				{ name: `:id: ID`, value: `${guild.id}`, inline: true },
				{
					name: `:busts_in_silhouette: Total members (${guild.memberCount})`,
					value: [
						`Members: ${guild.memberCount - botCount}`,
						`Bots: ${botCount}`
					].join("\n"), inline: true
				},
				{ name: `Roles`, value: `${userRoles.length}`, inline: true },
				{
					name: `Emojis and Stickers (${emojis.cache.size + stickers.cache.size})`,
					value: [
						`Animated ${emojis.cache.filter(emoji => emoji.animated).size}`,
						`Static ${emojis.cache.filter(emoji => !emoji.animated).size}`,
						`Stickers ${stickers.cache.size}`,
					].join("\n"), inline: true
				},
				{
					name: `Channels (${totalChannels})`,
					value: [
						`:hash: Text channel ${getChannelTypeSize([ChannelType.GuildText])}`,
						`:loud_sound: Voice channel ${getChannelTypeSize([ChannelType.GuildVoice])}`,
					].join("\n"), inline: true
				},
				{
					name: `Subscription:`,
					value: [
						`Lvl: ${guild.premiumTier || "None"}`,
						`Boosts: ${guild.premiumSubscriptionCount}`,
						`Boosters: ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
						`Total Boosters: ${guild.members.cache.filter(member => member.roles.premiumSince).size}`,
					].join("\n"), inline: true
				},
				{ name: `:lock: Verification level:`, value: `${baseVerification}`, inline: true },
			)

		await interaction.reply({ embeds: [embed] })
	}
}