import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TUser } from "./types/chat";
import { TFirst } from "./types/common";
import { TBannedUser, TBanUserParams, TBanUserResponse, TBlockedTerm, TBlockedTermsResponse, TGetBannedUsersParams, TGetBannedUsersResponse, TGetModeratorsResponse, TShieldMode } from "./types/moderation";
declare class Moderation extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    ban(broadcaster_id: string, data: TBanUserParams, moderator_id?: number): Promise<TBanUserResponse>;
    unban(broadcaster_id: string, user_id: string, moderator_id?: string): Promise<any>;
    bannedUsers(broadcaster_id: string, params?: TGetBannedUsersParams): Promise<TGetBannedUsersResponse>;
    allBannedUsers(broadcaster_id: string, limit?: number): Promise<TBannedUser[]>;
    moderators(broadcaster_id: string, params?: TFirst): Promise<TGetModeratorsResponse>;
    allModerators(broadcaster_id: string, limit?: number): Promise<TUser[]>;
    addModerator(broadcaster_id: string, user_id: string): Promise<any>;
    removeModerator(broadcaster_id: string, user_id: string): Promise<any>;
    blockedTerms(broadcaster_id: string, params?: TFirst, moderator_id?: string): Promise<TBlockedTermsResponse>;
    allBlockedTerms(broadcaster_id: string, limit?: number, moderator_id?: string): Promise<TBlockedTerm[]>;
    addBlockedTerm(broadcaster_id: string, text?: string, moderator_id?: string): Promise<any>;
    removeBlockedTerm(broadcaster_id: string, id: string, moderator_id?: string): Promise<any>;
    getShieldMode(broadcaster_id: string, moderator_id?: string): Promise<TShieldMode>;
    updateShieldMode(broadcaster_id: string, moderator_id?: string, is_active?: boolean): Promise<boolean>;
}
export default Moderation;
