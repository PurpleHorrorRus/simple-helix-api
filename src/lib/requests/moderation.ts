import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";
import { TUser } from "./types/chat";
import { TFirst } from "./types/common";

import {
    TBannedUser,
    TBanUserParams,
    TBanUserResponse,
    TBlockedTerm,
    TBlockedTermsResponse,
    TGetBannedUsersParams,
    TGetBannedUsersResponse,
    TGetModeratorsResponse,
    TShieldMode
} from "./types/moderation";

class Moderation extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async ban(broadcaster_id: string, data: TBanUserParams, moderator_id?: number): Promise<TBanUserResponse> {
        return await this.post("moderation/bans", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id,
            ...data
        });
    }

    async unban(broadcaster_id: string, user_id: string, moderator_id?: string) {
        return await this.delete("moderation/bans", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id,
            user_id
        });
    }

    async bannedUsers(broadcaster_id: string, params?: TGetBannedUsersParams): Promise<TGetBannedUsersResponse> {
        return await this.getRequest("moderation/banned", {
            broadcaster_id,
            ...params
        });
    }

    async allBannedUsers(broadcaster_id: string, limit = Infinity): Promise<TBannedUser[]> {
        return await this.requestAll(broadcaster_id, this, "bannedUsers", limit);
    }

    async moderators(broadcaster_id: string, params?: TFirst): Promise<TGetModeratorsResponse> {
        return await this.getRequest("moderation/moderators", {
            broadcaster_id,
            ...params
        });
    }

    async allModerators(broadcaster_id: string, limit = Infinity): Promise<TUser[]> {
        return await this.requestAll(broadcaster_id, this, "moderators", limit);
    }

    async addModerator(broadcaster_id: string, user_id: string) {
        return await this.post("moderation/moderators", {
            broadcaster_id,
            user_id
        });
    }

    async removeModerator(broadcaster_id: string, user_id: string) { 
        return await this.delete("moderation/moderators", {
            broadcaster_id,
            user_id
        });
    }

    async blockedTerms(broadcaster_id: string, params?: TFirst, moderator_id?: string): Promise<TBlockedTermsResponse> {
        return await this.getRequest("moderation/blocked_terms", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id,
            ...params
        });
    }

    async allBlockedTerms(broadcaster_id: string, limit = Infinity, moderator_id?: string): Promise<TBlockedTerm[]> {
        return await this.requestAll([
            broadcaster_id,
            moderator_id || broadcaster_id
        ], this, "blockedTerms", limit);
    }

    async addBlockedTerm(broadcaster_id: string, text?: string, moderator_id?: string,) {
        return await this.post("moderation/blocked_terms", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id,
            text
        });
    }

    async removeBlockedTerm(broadcaster_id: string, id: string, moderator_id?: string) {
        return await this.delete("moderation/blocked_terms", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id,
            id
        });
    }

    async getShieldMode(broadcaster_id: string, moderator_id?: string): Promise<TShieldMode> { 
        return await this.getRequest("moderation/shield_mode", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id
        });
    }

    async updateShieldMode(broadcaster_id: string, moderator_id?: string, is_active = false): Promise<boolean> {
        return await this.put("moderation/shield_mode", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id,
            is_active
        });
    }
}

export default Moderation;