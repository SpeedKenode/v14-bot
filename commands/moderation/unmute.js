const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Unmute a member from the server")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Select the user you wish to unmute.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser("target");
        const member = guild.members.cache.get(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`:x: Something wrong here`)
            .setColor("#06016b")
            .setTimestamp()
        
        const noperm = new EmbedBuilder()
            .setDescription(`:x: You don't have permission to do it.`)
            .setColor("#06016b")
            .setTimestamp()

        const embed = new EmbedBuilder()
            .setTitle("**:white_check_mark: Unmuted**")
            .setDescription(`Succesfully unmuted ${user}.`)
            .setColor("#06016b")
            .setTimestamp()

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [noperm], ephemeral: true });

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [noperm], ephemeral: true });

        try {
            await member.timeout(null);

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}