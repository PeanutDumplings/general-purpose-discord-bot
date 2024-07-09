import { ChatInputCommandInteraction, type ColorResolvable, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandConfig } from "../../classes/CommandConfig";
import { Command } from "../../classes/Command";
import config from "../../config";

const commandBuilder = new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
commandBuilder.addUserOption((option) => option.setName("userid").setDescription("The id of the user to unban").setRequired(true));

const commandConfig = new CommandConfig(commandBuilder);

const command = async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.getUser("userid");

    const embed = new EmbedBuilder().setColor(config.colours.success as ColorResolvable);

    try {
        await interaction.guild?.bans.remove(user!);
        return await interaction.reply({
            embeds: [embed.setDescription(`${config.emojis.success} ${user} was successfully unbanned`)],
        });
    } catch (error) {
        return await interaction.reply({
            embeds: [embed.setColor(config.colours.failure as ColorResolvable).setDescription(`${user} is not banned`)],
            ephemeral: true,
        });
    }
};

export default new Command(commandConfig, command);
