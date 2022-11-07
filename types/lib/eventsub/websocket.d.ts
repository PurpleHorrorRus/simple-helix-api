/// <reference types="node" />
import { AxiosRequestHeaders } from "axios";
import { EventEmitter } from "node:events";
import Websocket from "reconnecting-websocket";
import EventSubEvent from "./event";
import Static from "../static";
import { TEventType } from "./types/events";
declare class EventSub extends Static {
    private readonly endpoint;
    private connected;
    private readonly transport;
    client: Websocket;
    readonly events: EventEmitter;
    constructor(headers: AxiosRequestHeaders);
    connect(events: EventSubEvent[]): Promise<EventSub>;
    private onConnect;
    onDisconnect(reason: any): void;
    listen(): EventSub;
    send(message: string): boolean;
    subscribe(event: EventSubEvent): Promise<any>;
    on(event: TEventType, listener: (...args: any) => void): EventEmitter;
    once(event: TEventType, listener: (...args: any) => void): EventEmitter;
    handle(): Promise<unknown>;
}
export default EventSub;
