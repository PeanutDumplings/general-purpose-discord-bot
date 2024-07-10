import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandConfig } from "../../classes/CommandConfig";
import { Command } from "../../classes/Command";
import config from "../../config";

const commandBuilder = new SlashCommandBuilder().setName("user").setDescription("Get various data of a specified user");

commandBuilder.addSubcommand((subcommand) =>
    subcommand
        .setName("avatar")
        .setDescription("Get your avatar, or someone else's avatar")
        .addUserOption((option) => option.setName("user").setDescription("The user to get the avatar of"))
);

commandBuilder.addSubcommand((subcommand) =>
    subcommand
        .setName("banner")
        .setDescription("Get your banner, or someone else's banner")
        .addUserOption((option) => option.setName("user").setDescription("The user to get the banner of"))
);

const commandConfig = new CommandConfig(commandBuilder);

const command = async (interaction: ChatInputCommandInteraction) => {
    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser("user") || interaction.user;

    const embed = new EmbedBuilder().setColor(config.colours.blurple);

    if (subcommand === "avatar") {
        embed.setTitle(`${user.username}'s Avatar`);
        embed.setImage(`${user.displayAvatarURL({ size: 4096 })}`);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setURL(`${user.displayAvatarURL({ size: 4096 })}`)
                .setLabel("Link")
                .setStyle(ButtonStyle.Link)
        );

        return await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    } else if (subcommand === "banner") {
        await user.fetch(true);

        if (!user.banner) {
            return await interaction.reply({
                embeds: [embed.setDescription(`${config.emojis.error} ${user} does not have a banner`)],
                ephemeral: true,
            });
        }

        embed.setTitle(`${user.username}'s Banner`);
        embed.setImage(`${user.bannerURL({ size: 2048 })}`);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setURL(`${user.bannerURL({ size: 2048 })}`)
                .setLabel("Link")
                .setStyle(ButtonStyle.Link)
        );

        return await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    }
};

export default new Command(commandConfig, command);
