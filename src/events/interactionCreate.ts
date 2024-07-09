import { Events, type Interaction, codeBlock, inlineCode } from "discord.js";
import { Event } from "../classes/Event";
import { EventConfig } from "../classes/EventConfig";

const eventConfig: EventConfig = {
    name: Events.InteractionCreate,
    once: false,
};

const event = async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.run(interaction);
        } catch (error) {
            console.error(error);
            return await interaction.reply({
                content: `An error occured while executing command ${inlineCode(interaction.commandName)}:\n${codeBlock("js", error as string)}`,
            });
        }
    }
};

export default new Event(eventConfig, event);
