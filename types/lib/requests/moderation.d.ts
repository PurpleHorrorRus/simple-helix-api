import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Moderation extends Static {
    constructor(headers: AxiosRequestHeaders);
    ban(broadcaster_id: number, moderator_id: number, data?: any): Promise<any>;
    unban(broadcaster_id: number, moderator_id: number, user_id: number): Promise<any>;
    bannedUsers(broadcaster_id: number, params?: {}): Promise<any>;
    allBannedUsers(broadcaster_id: number, limit?: number): Promise<any>;
    moderators(broadcaster_id: number, params?: {}): Promise<any>;
    allModerators(broadcaster_id: number, limit?: number): Promise<any>;
    addModerator(broadcaster_id: number, user_id: number): Promise<any>;
    removeModerator(broadcaster_id: number, user_id: number): Promise<any>;
    blockedTerms(broadcaster_id: number, moderator_id: number, params?: {}): Promise<any>;
    allBlockedTerms(broadcaster_id: number, moderator_id: number, limit?: number): Promise<any>;
    addBlockedTerm(broadcaster_id: number, moderator_id: number, text: string): Promise<any>;
    removeBlockedTerm(broadcaster_id: number, moderator_id: number, id: number): Promise<any>;
}
export default Moderation;
