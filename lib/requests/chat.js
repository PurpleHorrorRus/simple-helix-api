const Static = require("../static");

class Chat extends Static {
    constructor(headers) {
        super(headers);
        
        this.ERRORS = {
            ...this.ERRORS,
            MISSING_EMOTE_SET_ID: "You must to specify emote_set_id",
            INVALID_SETTINGS: "Settings object is invalid"
        };
    }

    async globalEmotes() {
        return await this.requestCustom("chat/emotes/global");
    }

    async emotes(broadcaster_id) {
        return await this.requestCustom("chat/emotes", broadcaster_id);
    }

    async emoteSets(emote_set_id) {
        if (!emote_set_id) {
            return this.handleError(this.ERRORS.MISSING_EMOTE_SET_ID);
        }

        return await this.requestEndpoint("helix/chat/emotes/set", { emote_set_id });
    }

    async globalBadges() {
        return await this.requestEndpoint("chat/badges/global");
    }

    async badges(broadcaster_id) {
        return await this.requestCustom("chat/badges", broadcaster_id);
    }

    async settings(broadcaster_id, moderator_id) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        return await this.requestCustom("chat/settings", broadcaster_id, { moderator_id });
    }

    async updateSettings(broadcaster_id, moderator_id, settings) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!(settings instanceof Object) || Object.keys(settings).length === 0) {
            return this.handleError(this.ERRORS.INVALID_SETTINGS);
        }

        return await this.requestCustom("chat/settings", broadcaster_id, { moderator_id }, {
            method: "PATCH",
            body: settings,
            ignoreStatus: true
        });
    }
};

module.exports = Chat;