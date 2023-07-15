const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user from the the server.")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("User to be kicked.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the kick.")
        ),

    async execute(interaction) {
        const { options } = interaction;
        const user = options.getUser("target");
        const reason = options.getString("reason") || "No reason provided";
        const member = await interaction.guild.members.fetch(user.id);

        const noperm = new EmbedBuilder()
            .setDescription(`:x: You don't have permission to do it.`)
            .setColor("#06016b")
            .setTimestamp()
        
        const dms = new EmbedBuilder()
            .setColor("#06016b")
            .setDescription(`You have been kicked from **${interaction.guild.name}**.`)
            .setTimestamp()

        const embed = new EmbedBuilder()
            .setColor("#06016b")
            .setDescription(`:white_check_mark: Succesfully kicked ${user}`)
            .addFields( { name: "Reason", value: `${reason}`, inline: true } )
            .setTimestamp()
        
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return interaction.reply({ embeds: [noperm], ephemeral: true })

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [noperm], ephemeral: true });
        
        await member.send({embeds: [dms]}).catch(err => {
            return;
        });

        await member.kick(reason);

        await interaction.reply({ embeds: [embed] });
    }
}