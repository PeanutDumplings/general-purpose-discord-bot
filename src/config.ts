import yaml from "js-yaml";
import fs from "node:fs";
interface Config {
    discordBotToken: string;
    discordBotClientID: string;
}

const configPath = "./config.yaml";
const configFile = yaml.load(fs.readFileSync(configPath, "utf-8")) as Config;

const config: Config = {
    discordBotToken: configFile.discordBotToken,
    discordBotClientID: configFile.discordBotClientID,
};

export default config;
