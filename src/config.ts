import yaml from "js-yaml";
import fs from "node:fs";
interface Config {
    discordBotToken: string;
    discordBotClientID: string;
    channels: {
        logs: string;
    };
    colours: {
        success: number;
        failure: number;
        warning: number;
        blurple: number;
        clear: number;
    };
    emojis: {
        arrow: string;
        dash: string;
        success: string;
        error: string;
        warning: string;
        info: string;
        staff: string;
        developer: string;
        banned: string;
        bot: string;
        join: string;
        leave: string;
        link: string;
    };
}

const configPath = "./config.yaml";
const configFile = yaml.load(fs.readFileSync(configPath, "utf-8")) as Config;

const config: Config = {
    discordBotToken: configFile.discordBotToken,
    discordBotClientID: configFile.discordBotClientID,
    channels: {
        logs: configFile.channels.logs,
    },
    colours: {
        success: configFile.colours.success,
        failure: configFile.colours.failure,
        warning: configFile.colours.warning,
        blurple: configFile.colours.blurple,
        clear: configFile.colours.clear,
    },
    emojis: {
        success: configFile.emojis.success ?? "✅",
        error: configFile.emojis.error ?? "❌",
        warning: configFile.emojis.warning ?? "⚠️",
        arrow: configFile.emojis.arrow ?? "➡️",
        dash: configFile.emojis.dash ?? "➖",
        info: configFile.emojis.info ?? "ℹ️",
        staff: configFile.emojis.staff ?? "👮",
        developer: configFile.emojis.developer ?? "👨‍💻",
        banned: configFile.emojis.banned ?? "🚫",
        bot: configFile.emojis.bot ?? "🤖",
        join: configFile.emojis.join ?? "📥",
        leave: configFile.emojis.leave ?? "📤",
        link: configFile.emojis.link ?? "🔗",
    },
};

export default config;
