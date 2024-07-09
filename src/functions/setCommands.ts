import { Collection, REST, Routes } from "discord.js";
import type { Command } from "../classes/Command";
import fs from "node:fs";
import chalk from "chalk";
import config from "../config";

export default async function setCommands(): Promise<Collection<string, Command>> {
    const commands = new Collection<string, Command>();
    const commandFolders = fs.readdirSync("./src/commands");
    const commandArray: Array<Command> = [];
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".ts"));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`).default;
            if (!command) {
                throw new Error(chalk.red(`Command requires a ${chalk.italic("CommandConfig object")} and a ${chalk.italic("run function")}`));
            }
            try {
                commands.set(file.split(".")[0], command);
                commandArray.push(command.config.data.toJSON());
            } catch (error) {
                throw new Error(chalk.red(`Error loading command ${file}: ${error}`));
            }
        }
    }

    return commands;

    const rest = new REST({ version: "10" }).setToken(config.discordBotToken);
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const data: any = await rest.put(Routes.applicationCommands(config.discordBotClientID), { body: commandArray });
                console.log(chalk.blueBright(`Loaded ${data.length} commands`));
                resolve(commands);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        })();
    });
}
