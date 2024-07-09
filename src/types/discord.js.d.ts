import { Collection } from "discord.js";
import type { Command } from "../classes/Command";
import type { Event } from "../classes/Event";

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>;
        events: Collection<string, Event>;
    }
}
