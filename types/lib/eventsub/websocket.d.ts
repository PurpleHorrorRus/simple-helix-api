/// <reference types="node" />
import { RawAxiosRequestHeaders } from "axios";
import { EventEmitter } from "node:events";
import ReconnectingWebsocket from "reconnecting-websocket";
import Static from "../static";
import { TEventsubConnectOptions } from "./types/eventsub";
import { TEventType } from "./types/events";
declare class EventSub extends Static {
    private readonly endpoint;
    private readonly transport;
    private readonly defaultConnectionOptions;
    options: TEventsubConnectOptions;
    connection: ReconnectingWebsocket;
    subscribedEvents: Partial<Record<TEventType, (...args: any) => any>>;
    readonly events: EventEmitter;
    readonly WebsocketEvents: {
        CONNECTED: string;
        DISCONNECTED: string;
    };
    constructor(headers: RawAxiosRequestHeaders);
    connect(options?: TEventsubConnectOptions): Promise<EventSub>;
    disconnect(): void;
    private onConnect;
    private onDisconnect;
    private onMessage;
    private onEventMessage;
    subscribe(type: TEventType, condition: Record<string, string>, listener: (...args: any) => any, version?: number): Promise<boolean>;
    get connected(): boolean;
}
export default EventSub;
