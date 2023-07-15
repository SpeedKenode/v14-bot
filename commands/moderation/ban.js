const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member from the server")
        .addUserOption(option => 
            option.setName("target")
            .setDescription("The member you want to ban")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("reason")
            .setDescription("Reason for the ban")
        ),
    
    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser("target");
        const reason = options.getString("reason") || "No reason given";
        const member = await interaction.guild.members.fetch(user.id);

        const noperm = new EmbedBuilder()
            .setColor("#06016b")
            .setDescription(`:x: You don't have permission to do it`)
            .setTimestamp()
        
        const dms = new EmbedBuilder()
            .setColor("#06016b")
            .setDescription(`You have been banned from **${interaction.guild.name}**.`)
            .setTimestamp()
        
        const embed = new EmbedBuilder()
            .setColor("#06016b")
            .setDescription(`:white_check_mark: Successfully kicked${user}`)
            .addFields( { name: "Reason", value: `${reason}`, inline: true } )
            .setTimestamp()
        
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return interaction.reply({ embeds: [noperm], ephemeral: true })
        
        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return await interaction.reply({embeds: [noperm], ephemeral: true });
        
        await member.send({embeds: [dms]}).catch(err => {
            return;
        });

        await member.ban({ reason });
        
        await interaction.reply({embeds: [embed] });
    }
}