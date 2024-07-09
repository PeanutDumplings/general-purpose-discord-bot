import { SlashCommandBuilder } from "discord.js";

export class CommandConfig {
    data: SlashCommandBuilder;

    constructor(data: SlashCommandBuilder) {
        this.data = data;
        if (!this.data) {
            throw new Error("CommandConfig requires a SlashCommandBuilder object");
        }
    }
}
