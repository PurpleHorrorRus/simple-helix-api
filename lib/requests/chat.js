const Static = require("../static");

class Chat extends Static {
    constructor(headers) {
        super(headers);
        
        this.ERRORS = {
            ...this.ERRORS,
            MISSING_EMOTE_SET_ID: "You must to specify emote_set_id"
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
};

module.exports = Chat;