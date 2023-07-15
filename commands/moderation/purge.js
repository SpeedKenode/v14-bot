const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Delete message")
        .addIntegerOption(option => 
            option.setName("amount")
            .setDescription("The amount of message")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        ),

    async execute (interaction) {
        let number = interaction.options.getInteger("amount");

        const noperm = new EmbedBuilder()
            .setColor("#06016b")
            .setDescription(`:x: You don't have permission to do it`)
            .setTimestamp()
        
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`:wastebasket: Deleted ${number} message.`)
            .setTimestamp()
        
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
            return interaction.reply({ embeds: [noperm], ephemeral: true })
        
        await interaction.channel.bulkDelete(number)
        await interaction.reply({ embeds: [embed] , ephemeral: true});
    }
}