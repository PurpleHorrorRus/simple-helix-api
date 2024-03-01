import ReconnectingWebSocket from "reconnecting-websocket";
import WebSocket, { Data } from "ws";
import EventEmitter from "events";

import TMIParser from "./parser";
import { parse as IRCParser, IRCMessage } from "irc-message-ts";

import { TChatOptions } from "./types/chat";
import { TChatEvent } from "./types/events";

class TMIClient extends TMIParser { 
	private readonly endpoint = "ws://irc-ws.chat.twitch.tv:80";
	private readonly secureEndpoint = "wss://irc-ws.chat.twitch.tv:443";
    
	private defaultOptions: TChatOptions = {
		debug: false,
		secure: true
	};

	public options: TChatOptions = this.defaultOptions;

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
    
	public connect(
		username: string,
		password: string,
		channels: string[] = [username],
		options: TChatOptions = this.defaultOptions
	): Promise<TMIClient> {
		if (!username || !password) {
			throw new Error("You must to specify username and password");
		}

		if (!password.startsWith("oauth")) { 
			password = `oauth:${password}`;
		}

		this.options = options;
		this.channels = channels;

		const endpoint = options.secure
			? this.secureEndpoint
			: this.endpoint;

		this.connection = new ReconnectingWebSocket(endpoint, "irc", {
			WebSocket: global?.WebSocket || WebSocket,
			startClosed: true,
			maxRetries: Infinity
		});

		return new Promise((resolve, reject) => {
			this.connection.onopen = () => this.auth(username, password);
			this.connection.onclose = ({ reason }) => this.onDisconnect(reason, reject);
			this.connection.onmessage = ({ data }) => this.onMessage(data, resolve, reject);
			return this.connection.reconnect();
		});
	}

	public disconnect() {
		if (this.connection.readyState !== this.connection.OPEN) {
			return false;
		}

		this.connection.close(4003, "Manual disconnecting");
		return true;
	} 

	private prepareMessage(data: Data) { 
		const ircMessage = (data as string).trim();
                
		if (this.options.debug) {
			console.log("[simple-helix-api] Chat Raw Message:", ircMessage);
		}

		return ircMessage.split("\r\n").map(IRCParser);
	}

	private auth(username: string, password: string) {
		this.connection.send("CAP REQ :twitch.tv/commands twitch.tv/membership twitch.tv/tags");
		this.connection.send(`PASS ${password}`);
		this.connection.send(`NICK ${username}`);
	} 

	private join(channels: string[]): void { 
		this.channels = this.parseChannels(channels);
		this.connection.send(`JOIN ${this.channels.join(",")}`);
	}

	private initGlobalState(parsed: IRCMessage): void {
		this.globalUserState = {
			...parsed.tags,
			...this.message(parsed)
		};
	}

	private initUserState(parsed: IRCMessage): void {
		this.userState = {
			...parsed.tags,
			...this.message(parsed)
		};
	}

	private ping(parsed: IRCMessage): void { 
		this.connection.send(`PONG :${parsed.param}`);
	}

	private onConnected(): TMIClient { 
		this.events.emit(this.WebsocketEvents.CONNECTED);
		return this;
	}

	private onDisconnect(reason: string, reject: (...args: any) => void): void { 
		if (this.connection.readyState === this.connection.CLOSING) { 
			return reject(false);
		}

		this.events.emit(this.WebsocketEvents.DISCONNECTED, reason);
		return reject(reason);
	}

	private onMessage(
		data: Data, 
		resolve: (...args: any) => void,
		reject: (...args: any) => void
	): boolean { 
		for (const parsed of this.prepareMessage(data)) { 
			if (!(parsed?.command)) {
				return false;
			}
            
			switch (parsed.command) { 
			case "001": {
				this.join(this.channels);
				break;
			}
                    
			case "GLOBALUSERSTATE": { 
				this.initGlobalState(parsed);
				break;
			}
                    
			case "USERSTATE": { 
				this.initUserState(parsed);
				break;
			}
                    
			case "366": { 
				resolve(this.onConnected());
				break;
			}
                    
			case "NOTICE": {
				if (this.AuthErrors.includes(parsed.params[1])) {
					reject(parsed.params[1]);
				}

				break;
			}
                    
			case "PING": { 
				this.ping(parsed);
				break;
			}

			default: {
				this.onChatMessage(parsed as IRCMessage);
				break;
			}
			}

			this.events.emit(parsed.command, parsed);
		}

		return true;
	}

	private onChatMessage(parsed: IRCMessage) { 
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

	public say(
		text: string,
		channel: string | string[] = this.channels[0],
		tags?: Record<string, string>
	) { 
		if (!this.connected || !text) {
			return false;
		}

		channel = Array.isArray(channel)
			? this.parseChannels(channel).join(",")
			: this.parseChannel(channel);

		text = text.substring(0, 500);

		let command: string = `PRIVMSG ${channel} :${text}`;

		if (tags) {
			command = Object.keys(tags).map(key => { 
				return `@${key}=${tags[key]}`;
			}) + " " + command;
		}
        
		this.connection.send(command.trim());
		this.events.emit("message", {
			...this.globalUserState,
			...this.userState,
			text
		});

		return Boolean(this.connected);
	}

	public command(
		command: string,
		args: string | string[] = [],
		channel: string | string[] = this.channels[0]
	): boolean { 
		if (!command.startsWith("/")) {
			command = "/" + command;
		}
        
		if (args.length > 0) { 
			command += " " + (Array.isArray(args)
				? args.join(" ")
				: args);
		}

		return this.say(command, channel);
	}

	public on(event: TChatEvent, listener: (...args: any) => any): EventEmitter { 
		return this.events.on(event as string, listener);
	}

	public once(event: TChatEvent, listener: (...args: any) => any): EventEmitter { 
		return this.events.once(event as string, listener);
	}

	get connected(): boolean { 
		return this.connection.readyState === this.connection.OPEN;
	}
}

export default TMIClient;