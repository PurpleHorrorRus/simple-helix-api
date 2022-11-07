import { TEventType } from "./types/events";

class EventSubEvent {     
    constructor(
        public readonly type: TEventType,
        public condition: Record<string, string>,
        public readonly version: number = 1
    ) { }
}

export default EventSubEvent;