import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandConfig } from "../../classes/CommandConfig";
import { Command } from "../../classes/Command";
import config from "../../config";

const commandBuilder = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a member from a guild")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

commandBuilder.addUserOption((option) => option.setName("user").setDescription("The user to ban").setRequired(true));
commandBuilder.addStringOption((option) => option.setName("reason").setDescription("The reason for banning the user").setRequired(false));

const commandConfig = new CommandConfig(commandBuilder);

const command = async (interaction: ChatInputCommandInteraction) => {
    const user = await interaction.guild?.members.fetch(interaction.options.getUser("user")?.id!);
    const reason = interaction.options.getString("reason");
    const member = await interaction.guild?.members.fetch(interaction.user.id);

    const userEmbed = new EmbedBuilder().setColor(config.colours.failure);
    const serverEmbed = new EmbedBuilder().setColor(config.colours.blurple);

    if (user?.user.id === member?.user.id) {
        return await interaction.reply({
            embeds: [serverEmbed.setDescription(`${config.emojis.error} You cannot ban yourself`).setColor(config.colours.failure)],
            ephemeral: true,
        });
    }

    if (user?.roles.highest.position! >= member?.roles.highest.position!) {
        return await interaction.reply({
            embeds: [
                serverEmbed
                    .setDescription(
                        `${config.emojis.error} You cannot ban ${user?.user}\n**Reason:** Your top role is not higher than ${user?.user}'s`
                    )
                    .setColor(config.colours.failure),
            ],
            ephemeral: true,
        });
    }

    if (user?.user.id === interaction.client.user.id) {
        return await interaction.reply({
            embeds: [serverEmbed.setDescription(`${config.emojis.error} You cannot ban this bot`).setColor(config.colours.failure)],
            ephemeral: true,
        });
    }

    if (!user?.bannable) {
        return await interaction.reply({
            embeds: [serverEmbed.setDescription(`${config.emojis.error} ${user} cannot be banned by me`).setColor(config.colours.failure)],
            ephemeral: true,
        });
    }

    userEmbed.setTitle("Banned");
    userEmbed.setDescription(
        [
            `**Server**: \`${interaction.guild?.name}\``,
            `**Moderator**: ${member?.user} (${member?.user.id})`,
            `**Reason**: \`${reason ? reason : "no reason provided"}\``,
        ].join("\n")
    );
    userEmbed.setTimestamp();

    serverEmbed.setTitle("Banned");
    serverEmbed.setDescription(
        [
            `**User**: ${user} (${user?.id})`,
            `**Moderator**: ${member?.user} (${member?.user.id})`,
            `**Reason**: \`${reason ? reason : "no reason provided"}\``,
        ].join("\n")
    );
    serverEmbed.setColor(config.colours.blurple);

    const logsChannel = await interaction.guild?.channels.fetch(config.channels.logs);
    if (!logsChannel || logsChannel.type !== ChannelType.GuildText) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.colours.failure)
                    .setDescription("Invalid logs channel. Please update `config.yaml` with a valid text channel id"),
            ],
        });
    }

    await user?.send({ embeds: [userEmbed] });
    await user?.ban();
    await logsChannel.send({ embeds: [serverEmbed] });
    return await interaction.reply({
        embeds: [new EmbedBuilder().setDescription(`${config.emojis.success} ***${user}*** was banned`).setColor(config.colours.success)],
    });
};
export default new Command(commandConfig, command);
