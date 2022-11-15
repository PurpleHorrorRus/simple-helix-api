import ReconnectingWebSocket from "reconnecting-websocket";
import ws from "ws";
import EventEmitter from "events";

import TMIParser from "./parser";
import { parse as IRCParser, IRCMessage } from "irc-message-ts";

import { TChatEvent } from "./types/events";

class TMIClient extends TMIParser { 
    private readonly endpoint = "ws://irc-ws.chat.twitch.tv:80";

    private connection: ReconnectingWebSocket;
    private channels: string[];

    public readonly events: EventEmitter = new EventEmitter();
    public readonly WebsocketEvents = {
        CONNECTED: "connected",
        DISCONNECTED: "disconnected"
    };
    
    connect(username: string, password: string, channels: string[] = [username]): Promise<TMIClient> {
        if (!username || !password) {
            throw new Error("You must to specify username and password");
        }

        this.connection = new ReconnectingWebSocket(this.endpoint, [], {
            WebSocket: ws,
            maxRetries: Infinity,
            startClosed: true
        });

        return new Promise(resolve => {
            this.connection.addEventListener("open", () => {
                this.connection.send("CAP REQ :twitch.tv/commands twitch.tv/membership twitch.tv/tags");
                this.connection.send(`PASS ${password}`);
                this.connection.send(`NICK ${username}`);

                this.channels = this.parseChannels(channels);
                this.connection.send(`JOIN ${this.channels.join(",")}`);
                this.events.emit(this.WebsocketEvents.CONNECTED);
                return resolve(this);
            });

            this.connection.addEventListener("close", reason => {
                this.events.emit(this.WebsocketEvents.DISCONNECTED, reason);
            });

            this.connection.addEventListener("message", rawMesage => {
                const ircMessage = rawMesage.data.trim();

                for (const message of ircMessage.split("\r\n")) { 
                    const parsed = IRCParser(message);
                    this.onMessage(parsed as IRCMessage);
                }
            });

            return this.connection.reconnect();
        });
    }

    onMessage(parsed: IRCMessage) { 
        switch (parsed.command) {
            case "PRIVMSG": { 
                return this.events.emit("message", {
                    ...parsed.tags,
                    ...this.message(parsed),
                    text: parsed.params[1],
                    "first-msg": this.state(parsed.tags["first-msg"]),
                    "returning-chatter": this.state(parsed.tags["returning-chatter"])
                });
            }
                
            case "USERNOTICE": { 
                return this.events.emit(parsed.tags["msg-id"], this.message(parsed));
            }
                
            case "CLEARCHAT": { 
                return this.events.emit("clear", {
                    ...parsed.tags,
                    room: parsed.param,
                    "room-id": this.toNumber(parsed.tags["room-id"]),
                    date: this.date(parsed.tags["tmi-sent-ts"])
                });
            }
                
            case "CLEARMSG": { 
                return this.events.emit("delete", {
                    ...parsed.tags,
                    room: parsed.param,
                    "room-id": this.toNumber(parsed.tags["room-id"]),
                    "target-msg-id": this.toNumber(parsed.tags["target-msg-id"]),
                    date: this.date(parsed.tags["tmi-sent-ts"])
                });
            }
                
            default: {
                return this.events.emit(String(parsed.command), parsed.tags);
            }
        }
    }

    say(text: string, channel: string | string[] = this.channels[0]) { 
        if (!this.connected || !text) {
            return false;
        }

        channel = Array.isArray(channel)
            ? this.parseChannels(channel).join(",")
            : this.parseChannel(channel);

        this.connection.send(`PRIVMSG ${channel} :${text}`);
        return Boolean(this.connected);
    }

    on(event: TChatEvent, listener: (...args: any) => any) { 
        return this.events.on(event as string, listener);
    }

    once(event: TChatEvent, listener: (...args: any) => any) { 
        return this.events.once(event as string, listener);
    }

    get connected() { 
        return this.connection?.OPEN;
    }
}

export default TMIClient;