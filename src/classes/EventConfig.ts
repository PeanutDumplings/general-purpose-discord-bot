export class EventConfig {
    name: string;
    once: boolean;

    constructor(name: string, once: boolean) {
        this.name = name;
        this.once = once;
        if (!this.name || !this.once) {
            throw new Error("EventConfig requires a name string");
        }
    }
}
