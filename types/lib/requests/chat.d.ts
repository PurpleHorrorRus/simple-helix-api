import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TBadge, TChatSettings, TChattersResponse, TColor, TColorResponse, TEmote, TUser, TUserColor } from "./types/chat";
import { TFirst } from "./types/common";
declare class Chat extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    chatters(broadcaster_id: string, params?: TFirst, moderator_id?: string): Promise<TChattersResponse>;
    allChatters(broadcaster_id: string, limit?: number, moderator_id?: string): Promise<TUser[]>;
    globalEmotes(): Promise<TEmote[]>;
    emotes(broadcaster_id: string): Promise<TEmote[]>;
    emoteSets(emote_set_id: number): Promise<TEmote[]>;
    globalBadges(): Promise<TBadge[]>;
    announcement(broadcaster_id: string, moderator_id: string, message: string, color?: TColor): Promise<any>;
    shoutout(broadcaster_id: string, to_broadcaster_id: string, moderator_id?: string): Promise<any>;
    badges(broadcaster_id: string): Promise<TBadge[]>;
    deleteMessage(broadcaster_id: string, moderator_id: string, message_id: string): Promise<any>;
    color(user_id: string): Promise<TColorResponse>;
    updateColor(user_id: string, color: TUserColor): Promise<any>;
    settings(broadcaster_id: string, moderator_id?: number): Promise<TChatSettings>;
    updateSettings(broadcaster_id: string, moderator_id: string, settings: Partial<TChatSettings>): Promise<TChatSettings>;
}
export default Chat;
