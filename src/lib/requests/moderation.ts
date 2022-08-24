import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Moderation extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_USER_ID: "You must to specify user_id",
            BAN_USER_ID_NOT_SPECIFIED: "You must to specify user_id which you want to ban or data[] list of user names",
            BAN_USERS_LIST_INVALID: "The list is invalid",
            REASON_NOT_SPECIFIED: "You must to specify reason of ban",
            TERM_TEXT_EMPTY: "Term is empty",
            TERM_ID_NOT_SPECIFIED: "You must to specify term ID"
        };
    }

    async ban(broadcaster_id: number, moderator_id: number, data: any = {}) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!data?.user_id) {
            return this.handleError(this.ERRORS.BAN_USER_ID_NOT_SPECIFIED);
        }
        
        if (!data?.reason) {
            return this.handleError(this.ERRORS.REASON_NOT_SPECIFIED);
        }

        return await this.requestCustom("moderation/bans", broadcaster_id, { moderator_id }, { 
            method: "POST", 
            data: { data }
        });
    }

    async unban(broadcaster_id: number, moderator_id: number, user_id: number) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        return await this.requestCustom("moderation/bans", broadcaster_id, { moderator_id, user_id }, { method: "DELETE" });
    }

    async bannedUsers(broadcaster_id: number, params = {}) {
        return await this.requestCustom("moderation/banned", broadcaster_id, params);
    }

    async allBannedUsers(broadcaster_id: number, limit = Infinity) {
        return await this.requestAll(broadcaster_id, this, "bannedUsers", limit);
    }

    async moderators(broadcaster_id: number, params = {}) {
        return await this.requestCustom("moderation/moderators", broadcaster_id, params);
    }

    async allModerators(broadcaster_id: number, limit = Infinity) {
        return await this.requestAll(broadcaster_id, this, "moderators", limit);
    }

    async blockedTerms(broadcaster_id: number, moderator_id: number, params = {}) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        return await this.requestCustom("moderation/blocked_terms", broadcaster_id, { moderator_id, ...params });
    }

    async allBlockedTerms(broadcaster_id: number, moderator_id: number, limit = Infinity) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        return await this.requestAll([
            broadcaster_id,
            moderator_id
        ], this, "blockedTerms", limit);
    }

    async addBlockedTerm(broadcaster_id: number, moderator_id: number, text: string) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!text) {
            return this.handleError(this.ERRORS.TERM_TEXT_EMPTY);
        }

        return await this.requestCustom("moderation/blocked_terms", broadcaster_id, { moderator_id }, {
            method: "POST",
            data: { text }
        });
    }

    async removeBlockedTerm(broadcaster_id: number, moderator_id: number, id: number) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.TERM_ID_NOT_SPECIFIED);
        }

        return await this.requestCustom("moderation/blocked_terms", broadcaster_id, { 
            moderator_id,
            id
        }, { method: "DELETE" });
    }
};

export default Moderation;