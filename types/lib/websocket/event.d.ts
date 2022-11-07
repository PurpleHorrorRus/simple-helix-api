import { TEventType } from "./types/events";
declare class EventSubEvent {
    readonly type: TEventType;
    condition: Record<string, string>;
    readonly version: number;
    constructor(type: TEventType, condition: Record<string, string>, version?: number);
}
export default EventSubEvent;
