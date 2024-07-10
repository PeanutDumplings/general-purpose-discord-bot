import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandConfig } from "../../classes/CommandConfig";
import { Command } from "../../classes/Command";
import config from "../../config";

const commandBuilder = new SlashCommandBuilder().setName("ping").setDescription("View the bot and websocket latency.");

const commandConfig = new CommandConfig(commandBuilder);

const command = async (interaction: ChatInputCommandInteraction) => {
    const embed = new EmbedBuilder()
        .setTitle("Bot Latency")
        .setColor(config.colours.blurple)
        .setDescription(
            `**WebSocket Latency:** ${interaction.client.ws.ping}ms\n**Bot Latency**: ${Math.abs(Date.now() - interaction.createdTimestamp)}ms`
        )
        .setTimestamp();

    return await interaction.reply({ embeds: [embed] });
};

export default new Command(commandConfig, command);
