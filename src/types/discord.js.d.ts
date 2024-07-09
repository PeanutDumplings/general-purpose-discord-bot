import { Collection } from "discord.js";
import type { Command } from "../classes/Command";

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>;
    }
}
