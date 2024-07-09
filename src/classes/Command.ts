import { CommandConfig } from "./CommandConfig";

export class Command {
    config: CommandConfig;
    run: Function;

    constructor(config: CommandConfig, run: Function) {
        this.config = config;
        this.run = run;
        if (!this.config || !this.run) {
            throw new Error("Command requires a CommandConfig object");
        }
    }
}
