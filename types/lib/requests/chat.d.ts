import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare type TColor = "blue" | "green" | "orange" | "purple" | "primary";
declare type TUserColor = "blue" | "blue_violet" | "cadet_blue" | "chocolate" | "coral" | "dodger_blue" | "firebrick" | "golden_rod" | "green" | "hot_pink" | "orange_red" | "red" | "sea_green" | "spring_green" | "yellow_green";
declare class Chat extends Static {
    constructor(headers: AxiosRequestHeaders);
    globalEmotes(): Promise<any>;
    emotes(broadcaster_id: number): Promise<any>;
    emoteSets(emote_set_id: number): Promise<any>;
    globalBadges(): Promise<any>;
    announcement(broadcaster_id: number, moderator_id: number, message: string, color?: TColor): Promise<any>;
    badges(broadcaster_id: number): Promise<any>;
    delete(broadcaster_id: number, moderator_id: number, message_id: string): Promise<any>;
    color(user_id: number): Promise<any>;
    updateColor(user_id: number, color: TUserColor): Promise<any>;
    settings(broadcaster_id: number, moderator_id?: number): Promise<any>;
    updateSettings(broadcaster_id: number, moderator_id: number, settings: any): Promise<any>;
}
export default Chat;
