const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a member")
        .addStringOption(option => 
            option.setName("userid")
            .setDescription("The user id you want to unban")
            .setRequired(true)),
    
    async execute(interaction) {
        const { channel, options } = interaction;
        const userId = options.getString("userid");
        
        const noperm = new EmbedBuilder()
            .setColor("#06016b")
            .setDescription(`:x: You don't have permission to do it`)
            .setTimestamp()

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return interaction.reply({ embeds: [noperm], ephemeral: true })

        try {
            await interaction.guild.members.unban(userId)
            const embed = new EmbedBuilder()
                .setColor("#06016b")
                .setDescription(`:white_check_mark: <@${userId}> is unbanned`)
                .setTimestamp()
        
            await interaction.reply({ embeds: [embed] });

        } catch(err) {
            const errEmbed = new EmbedBuilder()
                .setColor("#06016b")
                .setDescription(`:x: The user is already unbanned or you don't have permission or may be something wrong here`)
                .setTimestamp()
            
            await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}