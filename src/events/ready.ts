import { Client, Events } from "discord.js";
import { EventConfig } from "../classes/EventConfig";
import { Event } from "../classes/Event";
import chalk from "chalk";

const eventConfig: EventConfig = {
    name: Events.ClientReady,
    once: true,
};

const event = async (client: Client) => {
    console.log(chalk.cyanBright(`Logged in as ${client.user?.username}`));
};

export default new Event(eventConfig, event);
