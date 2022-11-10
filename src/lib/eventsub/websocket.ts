import { AxiosRequestHeaders } from "axios";
import { EventEmitter } from "node:events";

import Websocket from "reconnecting-websocket";
import ws from "ws";

import EventSubEvent from "./event";
import Static from "../static";
import { TEventType } from "./types/events";

class EventSub extends Static { 
    private readonly endpoint = "wss://eventsub-beta.wss.twitch.tv/ws";

    private readonly transport = {
        method: "websocket",
        session_id: 0
    };

    public client: Websocket;
    public subscribedEvents: EventSubEvent[] = [];
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

    public connect(events: EventSubEvent[]): Promise<EventSub> {
        if (!events || events.length === 0 || !Array.isArray(events)) { 
            throw new Error(this.ERRORS.INVALID_EVENTS);
        }

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

                if (data.metadata.message_type === "session_welcome") {
                    this.onConnect(data);
                    this.registerEvents(events);
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

    private async registerEvents(events: EventSubEvent[]) {
        this.subscribedEvents = events;

        for (const event of events) { 
            await this.subscribe(event);
        }

        return true;
    }

    private onConnect(data: any): void {
        this.transport.session_id = data.payload.session.id;
        this.events.emit(this.WebsocketEvents.CONNECTED);
    }

    private onDisconnect(reason: any): void {
        this.transport.session_id = 0;
        this.subscribedEvents = [];
        this.events.emit(this.WebsocketEvents.DISCONNECTED, reason);
    }

    private onMessage(data: any): any {
        switch (data.metadata.message_type) { 
            case "notification": { 
                return this.events.emit(data.metadata.subscription_type, data.payload?.event);
            }
                
            default: { 
                return this.events.emit(data.metadata.message_type, data.payload);
            }
        }
    }

    public async subscribe(event: EventSubEvent): Promise<any> {
        return await this.requestEndpoint("eventsub/subscriptions", "", {
            method: "POST",
            data: {
                type: event.type,
                version: event.version || 1,
                condition: event.condition,
                transport: this.transport
            }
        });
    }

    public on(event: TEventType, listener: (...args: any) => void) { 
        return this.events.on(event, listener);
    }

    public once(event: TEventType, listener: (...args: any) => void) { 
        return this.events.once(event, listener);
    }

    public get connected(): boolean { 
        return Boolean(this.client?.OPEN);
    }
}

export default EventSub;