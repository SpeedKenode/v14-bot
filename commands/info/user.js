const { SlashCommandBuilder, EmbedBuilder, SlashCommandIntegerOption } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Get information about a user')
        .addUserOption(option => 
            option.setName("user")
            .setDescription("Select a user")
            .setRequired(false)
        ),

	async execute(interaction) {
        const { options } = interaction;
        const user = options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const icon = user.displayAvatarURL();
        const tag = user.username;

        const embed = new EmbedBuilder()
            .setColor("#06016b")
            .setAuthor({ name: tag, iconURL: icon})
            .setThumbnail(icon)
            .addFields(
                { name: "Name", value: `${user}`, inline: false},
                { name: "Roles", value: `${member.roles.cache.map(r => r).join(` `)}`, inline: false},
                { name: "Joined server: ", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true},
                { name: "Joined Discord: ", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true}
            )
            .setFooter({ text: `User ID: ${user.id}` })
            .setTimestamp()
        
        await interaction.reply({ embeds: [embed] });
	}
};