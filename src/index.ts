console.clear();

import chalk from "chalk";
import fs from "node:fs";
import { Client, GatewayIntentBits } from "discord.js";
import config from "./config";
import setCommands from "./functions/setCommands";

if (!fs.existsSync("config.yaml")) {
    console.error(chalk.bold(chalk.red('[Aborted] Unable to find configuration file.\nMake sure "config.yaml" exists at the root of this directory')));
    process.exit(1);
}

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands;

client.login(config.discordBotToken).then(async () => {
    client.commands = await setCommands();
    console.log("bot started");
});
