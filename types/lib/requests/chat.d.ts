import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Chat extends Static {
    constructor(headers: AxiosRequestHeaders);
    globalEmotes(): Promise<any>;
    emotes(broadcaster_id: number): Promise<any>;
    emoteSets(emote_set_id: number): Promise<any>;
    globalBadges(): Promise<any>;
    badges(broadcaster_id: number): Promise<any>;
    settings(broadcaster_id: number, moderator_id?: number): Promise<any>;
    updateSettings(broadcaster_id: number, moderator_id: number, settings: any): Promise<any>;
}
export default Chat;
