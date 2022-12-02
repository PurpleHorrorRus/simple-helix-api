import { IRCMessage } from "irc-message-ts";

import { TEmote } from "./types/chat";

class TMIParser { 
    parseChannels(channels: string[]): string[] { 
        return channels.map(channel => {
            return this.parseChannel(channel);
        });
    }

    parseChannel(channel: string): string { 
        return channel.startsWith("#", 0)
            ? channel.toLowerCase()
            : `#${channel}`.toLowerCase();
    }

    message(parsed: IRCMessage) { 
        return {
            "user-id": this.toNumber(parsed.tags["user-id"]),
            "room-id": this.toNumber(parsed.tags["room-id"]),
            "reply-parent-user-id": this.toNumber(parsed.tags["reply-parent-user-id"]),
            "badge-info": this.badges(parsed.tags["badge-info"]),
            "system-msg": this.state(parsed.tags["system-msg"]),
            badges: this.badges(parsed.tags.badges),
            emotes: this.emotes(parsed.params[1], parsed.tags.emotes),
            mod: this.state(parsed.tags.mod),
            subscriber: this.state(parsed.tags.subscriber),
            turbo: this.state(parsed.tags.turbo),
            vip: this.state(parsed.tags.vip),
            date: this.date(parsed.tags["tmi-sent-ts"])
        };
    }

    toNumber(source: string) { 
        return Number(source) || source || -1;
    }

    state(state: string) { 
        return Boolean(Number(state));
    }

    emotes(text: string, emotes: string): TEmote[] {
        if (!emotes) { 
            return [];
        }

        const result: TEmote = [];

        emotes.split("/").forEach(emote => {
            const [id, positionsRaw] = emote.split(":");

            const positions = positionsRaw.split(",").map(position => { 
                const splitted = position.split("-").map(Number);
                return [splitted[0], splitted[1] + 1];
            });

            result.push({
                code: text.substring(positions[0][0], positions[0][1]),
                id: parseInt(id),
                positions
            });
        });

        return result;
    }

    badges(badges: string): Record<string, number> {
        if (!badges) {
            return {};
        }

        const result: Record<string, number> = {};

        badges.split(",").forEach(badge => {
            const [name, state] = badge.split("/");
            return result[name] = Number(state);
        });

        return result;
    }

    date(timestamp: string | number) { 
        return new Date(Number(timestamp));
    }
}

export default TMIParser;