const Static = require("../static");

// Do not change this values. 
const pollConfig = {
    MAX_TITLE_LENGTH: 60,

    MIN_CHOICES: 2,
    MAX_CHOICES: 5,

    MAX_CHOICE_ITEM_TITLE_LENGTH: 25,

    MIN_TIMEOUT: 15,
    MAX_TIMEOUT: 1800
};

class Polls extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_TITLE: "Invalid poll title",
            CHOICES_LENGTH: "Poll must contain at least 2 choices and 5 maximum",
            INVALID_CHOICE: "Choices must be an array",
            INVALID_CHOICE_ITEM: "One of choise items is invalid",
            MISSING_ID: "Missing poll ID"
        };
    }

    /**
    * Check poll limitations: https://dev.twitch.tv/docs/api/reference#create-poll
    */
    async create(broadcaster_id, title, choices, duration = pollConfig.MIN_TIMEOUT) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!title) {
            return this.handleError(this.ERRORS.INVALID_TITLE);
        }

        if (!Array.isArray(choices)) {
            return this.handleError(this.ERRORS.INVALID_CHOICE);
        }

        if (choices.length < pollConfig.MIN_CHOICES || choices.length > pollConfig.MAX_CHOICES) {
            return this.handleError(this.ERRORS.CHOICES_LENGTH);
        }

        if (~choices.findIndex(item => !item.title)) {
            return this.handleError(this.ERRORS.INVALID_CHOICE_ITEM);
        };

        title = title.substring(0, pollConfig.MAX_TITLE_LENGTH);

        choices = choices.map(o => ({
            title: o.title.substring(0, pollConfig.MAX_CHOICE_ITEM_TITLE_LENGTH)
        }));

        duration = Math.max(Math.min(duration, pollConfig.MAX_TIMEOUT), pollConfig.MIN_TIMEOUT);

        return await this.requestEndpoint("polls", {}, {
            method: "POST",
            body: {
                broadcaster_id,
                title,
                choices,
                duration
            }
        });
    }

    async end(broadcaster_id, id, status = "ARCHIVED") {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_ID);
        }

        return await this.requestEndpoint("polls", {}, {
            method: "PATCH",
            body: {
                broadcaster_id,
                id,
                status
            }
        });
    }

    async get(broadcaster_id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint("polls", { broadcaster_id, ...params });
    }

    async all(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "get", params.limit);
    }
};

module.exports = Polls;