import { ChannelType, ChatInputCommandInteraction, type ColorResolvable, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
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
    const loggingEmbed = new EmbedBuilder().setColor(config.colours.blurple as ColorResolvable);

    try {
        await interaction.guild?.bans.remove(user!);
        const logsChannel = await interaction.guild?.channels.fetch(config.channels.logs);
        if (!logsChannel || logsChannel.type !== ChannelType.GuildText) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.colours.failure as ColorResolvable)
                        .setDescription("Invalid logs channel. Please update `config.yaml` with a valid text channel id"),
                ],
            });
        }

        await logsChannel.send({
            embeds: [
                loggingEmbed
                    .setTitle("Unbanned")
                    .setDescription([`**User**: ${user} (${user?.id})`, `**Moderator**: ${interaction.user} (${interaction.user.id})`].join("\n")),
            ],
        });

        return await interaction.reply({
            embeds: [embed.setDescription(`${config.emojis.success} ${user} was successfully unbanned`)],
        });
    } catch (error) {
        console.error(error);
        return await interaction.reply({
            embeds: [embed.setColor(config.colours.failure as ColorResolvable).setDescription(`${user} is not banned`)],
            ephemeral: true,
        });
    }
};

export default new Command(commandConfig, command);
