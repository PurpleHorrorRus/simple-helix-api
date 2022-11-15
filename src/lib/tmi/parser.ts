import { IRCMessage } from "irc-message-ts";

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

    emotes(text: string, emotes: string) {
        if (!emotes) { 
            return {};
        }

        const result: Record<string, Record<string, string | number>> = {};

        emotes.split("/").forEach(emote => {
            const [id, position] = emote.split(":");
            const [start, end] = position.split("-").map(Number);
            const emoteName = text.substring(start, end + 1);
            result[emoteName] = {
                code: emoteName,
                id: Number(id),
                start,
                end: end + 1
            };
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