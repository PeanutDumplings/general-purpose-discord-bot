import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandConfig } from "../../classes/CommandConfig";
import { Command } from "../../classes/Command";
import config from "../../config";

const commandBuilder = new SlashCommandBuilder().setName("purge").setDescription("Purge a specific number of messages from a channel");
commandBuilder.addNumberOption((option) => option.setName("amount").setDescription("Amount of messages to purge").setRequired(true));
commandBuilder.addUserOption((option) =>
    option.setName("user").setDescription("User to purge messages of (defaults to all users)").setRequired(false)
);

const commandConfig = new CommandConfig(commandBuilder);

const command = async (interaction: ChatInputCommandInteraction) => {
    const embed = new EmbedBuilder().setColor(config.colours.success);
    const logsEmbed = new EmbedBuilder().setColor(config.colours.blurple);
    const amount = interaction.options.getNumber("amount");
    let user = await interaction.guild?.members.fetch(interaction.options.getUser("user")?.id!);

    if (interaction.channel?.type !== ChannelType.GuildText) {
        return await interaction.reply({
            content: "This command must be ran in a guild text channel",
            ephemeral: true,
        });
    }

    if (!amount || !Number.isInteger(amount) || amount <= 0) {
        return await interaction.reply({
            content: `Message amount must be a postivie integer`,
            ephemeral: true,
        });
    }

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

    if (user?.id) {
        let messagesDeleted = 0;
        interaction.channel.messages
            .fetch()
            .then(async (messages) => {
                const userMessages = messages.filter((message) => message.author.id === user.id);

                for (const msg of userMessages) {
                    if (messagesDeleted >= amount) break;

                    try {
                        await msg[1].delete();
                        messagesDeleted++;
                    } catch (error) {
                        throw new Error(`Error: ${error}`);
                    }
                }

                await logsChannel.send({
                    embeds: [
                        logsEmbed
                            .setTitle("Purge")
                            .setDescription(
                                [
                                    `**Moderator**: ${interaction.user} (${interaction.user.id})`,
                                    `**Channel**: ${interaction.channel}`,
                                    `**Amount**: ${amount}`,
                                    `**User**: ${user} (${user.id})`,
                                ].join("\n")
                            ),
                    ],
                });

                await interaction.reply({
                    embeds: [
                        embed.setDescription(
                            `${config.emojis.success} Deleted ${messagesDeleted} ${messagesDeleted > 1 ? "messages" : "message"} from ${user}`
                        ),
                    ],
                    ephemeral: true,
                });
            })
            .catch(console.error);
    } else {
        await interaction.channel.bulkDelete(amount);
        await logsChannel.send({
            embeds: [
                logsEmbed
                    .setTitle("Purge")
                    .setDescription(
                        [
                            `**Moderator**: ${interaction.user} (${interaction.user.id})`,
                            `**Channel**: ${interaction.channel}`,
                            `**Amount**: ${amount}`,
                        ].join("\n")
                    ),
            ],
        });
        return await interaction.reply({
            embeds: [embed.setDescription(`${config.emojis.success} Deleted ${amount} ${amount > 1 ? "messages" : "message"}`)],
            ephemeral: true,
        });
    }
};

export default new Command(commandConfig, command);
