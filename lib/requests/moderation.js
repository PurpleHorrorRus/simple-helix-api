const Static = require("../static");
const Events = require("./events");
const Automod = require("./automod");

class Moderation extends Static {
    constructor(headers) {
        super(headers);
        this.bannedEvents = Events.prototype.banned;
        this.moderatorEvents = Events.prototype.moderator;
        this.automod = new Automod(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_USER_ID: "You must to specify user_id",
            BAN_USER_ID_NOT_SPECIFIED: "You must to specify user_id which you want to ban or data[] list of user names",
            BAN_USERS_LIST_EMPTY: "The list of users to ban must have at least one user",
            BAN_USERS_LIST_INVALID: "The list is invalid",
            REASON_NOT_SPECIFIED: "You must to specify reason of ban",
            TERM_TEXT_EMPTY: "Term is empty",
            TERM_ID_NOT_SPECIFIED: "You must to specify term ID"
        };
    }

    async ban(broadcaster_id, moderator_id, body = {}) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!body.data && !body.user_id) {
            return this.handleError(this.ERRORS.BAN_USER_ID_NOT_SPECIFIED);
        }

        if (body.data) {
            if (body.data.length === 0) {
                return this.handleError(this.ERRORS.BAN_USERS_LIST_EMPTY);
            }

            const listIsValid = body.data.findIndex(item => !item.user_id || !item.reason) === -1;
            if (!Array.isArray(body.data) || !listIsValid) {
                return this.handleError(this.ERRORS.BAN_USERS_LIST_INVALID)
            }
        }
        
        if (body.user_id) {
            if (!body.reason) {
                return this.handleError(this.ERRORS.REASON_NOT_SPECIFIED);
            }
        }

        return await this.requestCustom("moderation/bans", broadcaster_id, { moderator_id }, { 
            method: "POST", 
            body 
        });
    }

    async unban(broadcaster_id, moderator_id, user_id) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        return await this.requestCustom("moderation/bans", broadcaster_id, { moderator_id, user_id }, { method: "DELETE" });
    }

    async bannedUsers(broadcaster_id, params = {}) {
        return await this.requestCustom("moderation/banned", broadcaster_id, params);
    }

    async allBannedUsers(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "bannedUsers", params.limit);
    }

    async moderators(broadcaster_id, params = {}) {
        return await this.requestCustom("moderation/moderators", broadcaster_id, params);
    }

    async allModerators(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "moderators", params.limit);
    }

    async blockedTerms(broadcaster_id, moderator_id, params = {}) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        return await this.requestCustom("moderation/blocked_terms", broadcaster_id, { moderator_id, ...params });
    }

    async allBlockedTerms(broadcaster_id, moderator_id, params = {}) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        return await this.requestAll({ broadcaster_id, moderator_id }, this, "blockedTerms", params.limit);
    }

    async addBlockedTerm(broadcaster_id, moderator_id, text) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!text) {
            return this.handleError(this.ERRORS.TERM_TEXT_EMPTY);
        }

        return await this.requestCustom("moderation/blocked_terms", broadcaster_id, { moderator_id }, {
            method: "POST",
            body: { text }
        });
    }

    async removeBlockedTerm(broadcaster_id, moderator_id, id) {
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

module.exports = Moderation;