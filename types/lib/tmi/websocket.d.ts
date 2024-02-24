/// <reference types="node" />
import EventEmitter from "events";
import TMIParser from "./parser";
import { TChatOptions } from "./types/chat";
import { TChatEvent } from "./types/events";
declare class TMIClient extends TMIParser {
    private readonly endpoint;
    private readonly secureEndpoint;
    private defaultOptions;
    options: TChatOptions;
    private connection;
    private globalUserState;
    private userState;
    private channels;
    readonly events: EventEmitter;
    readonly WebsocketEvents: {
        CONNECTED: string;
        DISCONNECTED: string;
    };
    private readonly AuthErrors;
    connect(username: string, password: string, channels?: string[], options?: TChatOptions): Promise<TMIClient>;
    disconnect(): boolean;
    private prepareMessage;
    private auth;
    private join;
    private initGlobalState;
    private initUserState;
    private ping;
    private onConnected;
    private onDisconnect;
    private onMessage;
    private onChatMessage;
    say(text: string, channel?: string | string[], tags?: Record<string, string>): boolean;
    command(command: string, args?: string | string[], channel?: string | string[]): boolean;
    on(event: TChatEvent, listener: (...args: any) => any): EventEmitter;
    once(event: TChatEvent, listener: (...args: any) => any): EventEmitter;
    get connected(): boolean;
}
export default TMIClient;
