import { EventConfig } from "./EventConfig";

export class Event {
    config: EventConfig;
    run: Function;

    constructor(config: EventConfig, run: Function) {
        this.config = config;
        this.run = run;
        if (!this.config || !this.run) {
            throw new Error("Event requires an EventConfig object");
        }
    }
}
