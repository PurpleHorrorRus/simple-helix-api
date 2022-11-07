import { AxiosRequestHeaders } from "axios";
import { EventEmitter } from "node:events";

import Websocket from "reconnecting-websocket";

// @ts-ignore
import ws from "ws";

import EventSubEvent from "./event";
import Static from "../static";
import { TEventType } from "./types/events";

const WebsocketEvents = {
    CONNECTED: "connected",
    DISCONNECTED: "disconnected"
};

class EventSub extends Static { 
    private readonly endpoint = "wss://eventsub-beta.wss.twitch.tv/ws";

    private connected = false;
    private readonly transport = {
        method: "websocket",
        session_id: 0
    };

    public client: Websocket; 

    public readonly events = new EventEmitter();

    constructor(headers: AxiosRequestHeaders) { 
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_EVENTS: "Invalid array of events"
        };
    }

    public connect(events: EventSubEvent[]): Promise<EventSub> {
        if (!events || events.length === 0 || !Array.isArray(events)) { 
            throw new Error();
        }

        this.client = new Websocket(this.endpoint, undefined, {
            WebSocket: ws
        });

        this.client.onclose = this.onDisconnect;
        this.client.onerror = this.onDisconnect;

        return new Promise(resolve => { 
            this.client.onmessage = async message => { 
                const data = JSON.parse(message.data);
                
                if (data.metadata.message_type === "session_welcome") {
                    this.onConnect(data);

                    for (const event of events) { 
                        await this.subscribe(event);
                    }

                    return resolve(this);
                }
            };
        });   
    }

    private onConnect(data: any): void {
        if (this.connected) {
            return;
        }

        this.transport.session_id = data.payload.session.id;
        this.connected = true;
        this.events.emit(WebsocketEvents.CONNECTED);
    }

    public onDisconnect(reason: any): void {
        if (this.client.OPEN) { 
            this.client.close();
        }
        
        this.connected = false;
        this.events.emit(WebsocketEvents.DISCONNECTED, reason);
    }

    public listen(): EventSub { 
        this.client.onmessage = message => {
            const data = JSON.parse(message.data);

            switch (data.metadata.message_type) { 
                case "notification": { 
                    return this.events.emit(data.metadata.subscription_type, data.payload?.event);
                }
                    
                default: { 
                    return this.events.emit(data.metadata.message_type, data.payload);
                }
            }
        }

        return this;
    }

    public send(message: string): boolean { 
        if (!this.client || this.client.CLOSED) {
            return false;
        }

        this.client.send(message);
        return true;
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

    public handle() { 
        return new Promise(resolve => {
            setTimeout(resolve, 1000 * 60 * 60 * 5);
        });
    }
}

export default EventSub;