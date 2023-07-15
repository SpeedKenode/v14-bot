const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a member from the server.")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Select the user you wish to mute.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("time")
                .setDescription("How long should the mute last?")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason: ")
        ),

    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser("target");
        const member = guild.members.cache.get(user.id);
        const time = options.getString("time");
        const convertedTime = ms(time);
        const reason = options.getString("reason") || "No reason provided";

        const errEmbed = new EmbedBuilder()
            .setDescription(`:x: Something wrong here`)
            .setColor("#06016b")
            .setTimestamp()
        
        const noperm = new EmbedBuilder()
            .setDescription(`:x: You don't have permission to do it.`)
            .setColor("#06016b")
            .setTimestamp()

        const embed = new EmbedBuilder()
            .setTitle("**:white_check_mark: Muted**")
            .setDescription(`Succesfully muted ${user}.`)
            .addFields(
                { name: "Reason", value: `${reason}`, inline: true },
                { name: "Duration", value: `${time}`, inline: true }
            )
            .setColor("#06016b")
            .setTimestamp()

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [noperm], ephemeral: true });

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [noperm], ephemeral: true });

        if (!convertedTime)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(convertedTime, reason);

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    }
}