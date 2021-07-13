const Static = require("../static");
const Channel = require("./channel");

class Emotes extends Static {
    constructor(headers) {
        super(headers);
        this.channel = Channel.prototype.getEmotes;

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_EMOTE_SET_ID: "You must to specify emote_set_id"
        };
    }

    async global() {
        return await this.requestEndpoint("chat/emotes/global");
    }

    async sets(emote_set_id) {
        if (!emote_set_id) {
            return this.handleError(this.ERRORS.MISSING_EMOTE_SET_ID);
        }

        return await this.requestEndpoint("helix/chat/emotes/set", { emote_set_id });
    }
};

module.exports = Emotes;