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

commandBuilder.addSubcommand((subcommand) =>
    subcommand
        .setName("info")
        .setDescription("Get your user info, or someone else's user info")
        .addUserOption((option) => option.setName("user").setDescription("The user to get info of"))
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
    } else if (subcommand === "info") {
        await user.fetch(true);
        console.log(user.createdAt, user.createdTimestamp);

        const member = await interaction.guild?.members.fetch(user.id);
        if (!member) {
            return;
        }

        embed.setThumbnail(user.displayAvatarURL({ size: 4096, forceStatic: false }));
        if (user.banner) embed.setImage(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}.webp?size=2048`);
        embed.addFields(
            {
                name: "Username",
                value: user.username,
                inline: true,
            },
            {
                name: "User Id",
                value: user.id,
                inline: true,
            },
            {
                name: "Display Name",
                value: user.displayName,
            },
            {
                name: "Joined Discord",
                value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`,
                inline: true,
            },
            {
                name: `Joined ${interaction.guild?.name}`,
                value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:D>`,
                inline: true,
            }
        );

        return await interaction.reply({ embeds: [embed] });
    }
};

export default new Command(commandConfig, command);
