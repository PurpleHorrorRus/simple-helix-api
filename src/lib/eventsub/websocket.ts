import { RawAxiosRequestHeaders } from "axios";
import { EventEmitter } from "node:events";

import ReconnectingWebsocket from "reconnecting-websocket";
import WebSocket, { Data } from "ws";

import Static from "../static";
import { TEventsubConnectOptions } from "./types/eventsub";
import { TEventType } from "./types/events";

class EventSub extends Static { 
    private readonly endpoint = "wss://eventsub.wss.twitch.tv/ws";

    private readonly transport = {
        method: "websocket",
        session_id: 0,
        connected_at: ""
    };

    private readonly defaultConnectionOptions: TEventsubConnectOptions = {
        debug: false
    };

    public options: TEventsubConnectOptions = this.defaultConnectionOptions;

    public connection: ReconnectingWebsocket;
    public subscribedEvents: Partial<Record<TEventType, (...args: any) => any>> = {};
    public readonly events = new EventEmitter();
    public readonly WebsocketEvents = {
        CONNECTED: "connected",
        DISCONNECTED: "disconnected"
    };

    constructor(headers: RawAxiosRequestHeaders) { 
        super(headers);
    }

    public connect(options: TEventsubConnectOptions = this.defaultConnectionOptions): Promise<EventSub> {
        this.options = options;

        this.connection = new ReconnectingWebsocket(this.endpoint, [], {
            WebSocket,
            startClosed: true,
            maxRetries: Infinity
        });

        return new Promise((resolve, reject) => {
            this.connection.onclose = ({ reason }) => this.onDisconnect(reason, reject);
            this.connection.onmessage = ({ data }) => this.onMessage(data, resolve);
            return this.connection.reconnect();
        });  
    }

    public disconnect() {
        if (this.connection.readyState === this.connection.OPEN) { 
            this.connection.close(4003, "Manual disconnecting");
        }

        return this.onDisconnect("Manual Disconnecting", () => (false));
    }

    private onConnect(data: any): void {
        this.transport.session_id = data.payload.session.id;
        this.transport.connected_at = data.payload.connected_at;
        this.events.emit(this.WebsocketEvents.CONNECTED);
    }

    private onDisconnect(reason: string, reject: (...args: any) => void): void {
        if (this.connection.readyState === this.connection.CLOSING) {
            return reject(false);
        }

        this.transport.session_id = 0;
        this.subscribedEvents = {};
        this.events.emit(this.WebsocketEvents.DISCONNECTED, reason);

        return reject(reason)
    }

    private onMessage(data: Data, resolve: (...args: any) => void) { 
        const parsed: any = JSON.parse((data as string));

        if (this.options.debug) {
            console.log("[simple-helix-api] EventSub Data:", parsed);
        }

        if (parsed.metadata.message_type === "session_welcome") {
            resolve(this);
            return this.onConnect(parsed);
        }

        return this.onEventMessage(parsed);
    }

    private onEventMessage(data: any): any {
        const messageType: TEventType = data.metadata.message_type;

        switch (messageType) { 
            case "notification": { 
                const subscriptionType: TEventType = data.metadata.subscription_type;
                return this.subscribedEvents[subscriptionType]?.(data.payload?.event);
            }
                
            default: {
                return this.subscribedEvents[messageType]?.(data.payload);
            }
        }
    }

    public async subscribe(
        type: TEventType,
        condition: Record<string, string>,
        listener: (...args: any) => any,
        version = 1
    ) {
        await this.post("eventsub/subscriptions", {}, {
            type,
            version,
            condition,
            transport: this.transport
        });

        this.subscribedEvents[type] = listener;
        return true;
    }

    public get connected(): boolean { 
        return this.connection.readyState === this.connection.OPEN;
    }
}

export default EventSub;