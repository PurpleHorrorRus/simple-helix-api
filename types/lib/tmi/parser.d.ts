import { IRCMessage } from "irc-message-ts";
import { TEmote } from "./types/chat";
declare class TMIParser {
    parseChannels(channels: string[]): string[];
    parseChannel(channel: string): string;
    message(parsed: IRCMessage): {
        "user-id": string | number;
        "room-id": string | number;
        "reply-parent-user-id": string | number;
        "badge-info": Record<string, number>;
        "system-msg": boolean;
        badges: Record<string, number>;
        emotes: TEmote[];
        mod: boolean;
        subscriber: boolean;
        turbo: boolean;
        vip: boolean;
        date: Date;
    };
    toNumber(source: string): string | number;
    state(state: string): boolean;
    emotes(text: string, emotes: string): TEmote[];
    badges(badges: string): Record<string, number>;
    date(timestamp: string | number): Date;
}
export default TMIParser;
