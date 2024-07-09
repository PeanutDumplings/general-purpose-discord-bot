import { Collection } from "discord.js";
import fs from "node:fs";
import chalk from "chalk";
import { client } from "..";
import type { Event } from "../classes/Event";

export default async function setEvents(): Promise<Collection<string, Event>> {
    const events = new Collection<string, Event>();
    const eventFiles = fs.readdirSync("./src/events").filter((file) => file.endsWith(".ts"));
    for (const file of eventFiles) {
        const event = require(`../events/${file}`).default;
        if (!event || event.constructor.name !== "Event") {
            throw new Error(chalk.red(`Event ${file} requires an ${chalk.italic("EventConfig object")} and a ${chalk.italic("run function")}`));
        }
        if (event.once) {
            client.once(event.config.name, (...args) => event.run(...args));
        } else {
            client.on(event.config.name, (...args) => event.run(...args));
        }
        try {
            events.set(file, event);
        } catch (error) {
            throw new Error(chalk.red(`Error loading event ${file}: ${error}`));
        }
    }
    console.log(chalk.greenBright(`Loaded ${events.size} events`));
    return events;
}
