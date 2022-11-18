import ReconnectingWebSocket from "reconnecting-websocket";
import ws from "ws";
import EventEmitter from "events";

import TMIParser from "./parser";
import { parse as IRCParser, IRCMessage } from "irc-message-ts";

import { TChatOptions } from "./types/chat";
import { TChatEvent } from "./types/events";

class TMIClient extends TMIParser { 
    private readonly endpoint = "ws://irc-ws.chat.twitch.tv:80";
    private readonly secureEndpoint = "wss://irc-ws.chat.twitch.tv:443";

    private connection: ReconnectingWebSocket;
    private globalUserState = {};
    private userState = {};
    private channels: string[];

    public readonly events: EventEmitter = new EventEmitter();
    public readonly WebsocketEvents = {
        CONNECTED: "connected",
        DISCONNECTED: "disconnected"
    };

    private readonly AuthErrors: string[] = [
        "Login authentication failed",
        "You don’t have permission to perform that action"
    ];
    
    connect(username: string, password: string, channels: string[] = [username], options: TChatOptions): Promise<TMIClient> {
        if (!username || !password) {
            throw new Error("You must to specify username and password");
        }

        const endpoint = options.secure
            ? this.secureEndpoint
            : this.endpoint;

        this.connection = new ReconnectingWebSocket(endpoint, "irc", {
            WebSocket: ws,
            maxRetries: Infinity,
            startClosed: true
        });

        return new Promise((resolve, reject) => {
            this.connection.addEventListener("open", () => {
                this.connection.send("CAP REQ :twitch.tv/commands twitch.tv/membership twitch.tv/tags");
                this.connection.send(`PASS ${password}`);
                this.connection.send(`NICK ${username}`);
            });

            this.connection.addEventListener("close", reason => {
                this.events.emit(this.WebsocketEvents.DISCONNECTED, reason);
            });

            this.connection.addEventListener("message", rawMesage => {
                const ircMessage = rawMesage.data.trim();
                
                if (options.debug) {
                    console.log("[simple-helix-api] Chat Raw Message:", ircMessage);
                }

                for (const message of ircMessage.split("\r\n")) { 
                    const parsed = IRCParser(message);

                    if (!parsed?.command) {
                        return;
                    }
                    
                    switch (parsed.command) { 
                        case "001": {
                            this.channels = this.parseChannels(channels);
                            this.connection.send(`JOIN ${this.channels.join(",")}`);
                            break;
                        }
                            
                        case "GLOBALUSERSTATE": { 
                            this.globalUserState = {
                                ...parsed.tags,
                                ...this.message(parsed)
                            };

                            break;
                        }
                            
                        case "USERSTATE": { 
                            this.userState = {
                                ...parsed.tags,
                                ...this.message(parsed)
                            };

                            break;
                        }
                            
                        case "366": { 
                            this.events.emit(this.WebsocketEvents.CONNECTED);
                            resolve(this);
                            break;
                        }
                            
                        case "NOTICE": {
                            if (this.AuthErrors.includes(parsed.params[1])) {
                                reject(parsed.params[1]);
                            }

                            break;
                        }
                            
                        case "PING": { 
                            this.connection.send(`PONG :${parsed.param}`);
                            break;
                        }

                        default: {
                            this.onMessage(parsed as IRCMessage);
                            break;
                        }
                    }

                    this.events.emit(parsed.command, parsed);
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
                if (!parsed.params[1]) { 
                    return this.events.emit("clear", {
                        ...parsed.tags,
                        room: parsed.param,
                        "room-id": this.toNumber(parsed.tags["room-id"]),
                        date: this.date(parsed.tags["tmi-sent-ts"])
                    });
                }

                return this.events.emit("ban", {
                    ...parsed.tags,
                    "room-id": this.toNumber(parsed.tags["room-id"]),
                    target: this.toNumber(parsed.tags["target-user-id"]),
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
        }
    }

    say(text: string, channel: string | string[] = this.channels[0]) { 
        if (!this.connected || !text) {
            return false;
        }

        channel = Array.isArray(channel)
            ? this.parseChannels(channel).join(",")
            : this.parseChannel(channel);

        text = text.substring(0, 500);
        
        this.connection.send(`PRIVMSG ${channel} :${text}`);
        this.events.emit("message", {
            ...this.globalUserState,
            ...this.userState,
            text
        });

        return Boolean(this.connected);
    }

    command(command: string, args: string | string[] = [], channel: string | string[] = this.channels[0]) { 
        command = "/" + command.replace("/", "");
        
        if (args.length > 0) { 
            command += " " + (Array.isArray(args) ? args.join(" ") : args)
        }

        return this.say(command, channel);
    }

    on(event: TChatEvent, listener: (...args: any) => any) { 
        return this.events.on(event as string, listener);
    }

    once(event: TChatEvent, listener: (...args: any) => any) { 
        return this.events.once(event as string, listener);
    }

    get connected() { 
        return Boolean(this.connection?.OPEN);
    }
}

export default TMIClient;