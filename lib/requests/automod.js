const Static=require("../static");

class Automod extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_SETTINGS: "Settings object is invalid"
        };
    }

    async settings(broadcaster_id, moderator_id) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        return await this.requestCustom("moderation/automod/settings", broadcaster_id, { moderator_id });
    }

    async updateSettings(broadcaster_id, moderator_id, settings) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!(settings instanceof Object) || Object.keys(settings).length === 0) {
            return this.handleError(this.ERRORS.INVALID_SETTINGS);
        }

        return await this.requestCustom("moderation/automod/settings", broadcaster_id, { moderator_id }, {
            method: "PUT",
            body: settings,
            ignoreStatus: true
        });
    }
};

module.exports = Automod;