const Static = require("../static");

class Channel extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            EMPTY_TITLE_OR_GAME_ID: "You must to specify the title and game_id of stream"
        };
    }

    async get(broadcaster_id) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        const [data] = await this.requestEndpoint("channels", { broadcaster_id });
        return data;
    }

    async modify(broadcaster_id, game_id = "", broadcaster_language = "en", title, delay = 0) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!title || !game_id) {
            return this.handleError(this.ERRORS.EMPTY_TITLE_OR_GAME_ID);
        }

        return await this.requestEndpoint("channels", { broadcaster_id }, {
            method: "PATCH",
            body: {
                game_id,
                broadcaster_language,
                title,
                ...delay ? { delay } : {} // Notice: delay works only for partners
            }
        });
    }

    async editors(broadcaster_id) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint("channels/editors", { broadcaster_id });
    }

    async emotes(broadcaster_id) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint("chat/emotes", { broadcaster_id });
    }

    async badges(broadcaster_id) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint("chat/badges", { broadcaster_id });
    }
};

module.exports = Channel;