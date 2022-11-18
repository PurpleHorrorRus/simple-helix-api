import { AxiosRequestHeaders } from "axios";
import { EventEmitter } from "node:events";

import Websocket from "reconnecting-websocket";
import ws from "ws";

import Static from "../static";
import { TEventsubConnectOptions } from "./types/eventsub";
import { TEventType } from "./types/events";

class EventSub extends Static { 
    private readonly endpoint = "wss://eventsub-beta.wss.twitch.tv/ws";

    private readonly transport = {
        method: "websocket",
        session_id: 0
    };

    private readonly deafultConnectOptions: TEventsubConnectOptions = {
        debug: false
    };

    public client: Websocket;
    public subscribedEvents: Partial<Record<TEventType, (...args: any) => any>> = {};
    public readonly events = new EventEmitter();
    public readonly WebsocketEvents = {
        CONNECTED: "connected",
        DISCONNECTED: "disconnected"
    };

    constructor(headers: AxiosRequestHeaders) { 
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_EVENTS: "Invalid array of events"
        };
    }

    public connect(options: TEventsubConnectOptions = this.deafultConnectOptions): Promise<EventSub> {
        return new Promise((resolve, reject) => {
            this.client = new Websocket(this.endpoint, [], {
                WebSocket: ws,
                startClosed: true,
                maxRetries: Infinity
            });

            this.client.addEventListener("error", reason => {
                this.onDisconnect(reason);
                return this.client.reconnect();
            });
    
            this.client.addEventListener("close", reason => {
                this.onDisconnect(reason);
                return reject(reason);
            });

            this.client.addEventListener("message", message => {
                const data = JSON.parse(message.data);

                if (options.debug) {
                    console.log("[simple-helix-api] EventSub Data:", data);
                }

                if (data.metadata.message_type === "session_welcome") {
                    this.onConnect(data);
                    return resolve(this);
                }

                return this.onMessage(data);
            });

            return this.client.reconnect();
        });  
    }

    public disconnect() {
        if (this.client?.OPEN) { 
            this.client.close();
        }

        return this.onDisconnect("Manual disconnecting");
    }

    private onConnect(data: any): void {
        this.transport.session_id = data.payload.session.id;
        this.events.emit(this.WebsocketEvents.CONNECTED);
    }

    private onDisconnect(reason: any): void {
        this.transport.session_id = 0;
        this.subscribedEvents = {};
        this.events.emit(this.WebsocketEvents.DISCONNECTED, reason);
    }

    private onMessage(data: any): any {
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

    public async subscribe(type: TEventType, condition: Record<string, string>, listener: (...args: any) => any, version = 1): Promise<any> {
        await this.requestEndpoint("eventsub/subscriptions", "", {
            method: "POST",
            data: {
                type,
                version,
                condition,
                transport: this.transport
            }
        });

        this.subscribedEvents[type] = listener;
        return true;
    }

    public get connected(): boolean { 
        return Boolean(this.client?.OPEN);
    }
}

export default EventSub;