const Static = require("../static");
const Events = require("./events");

class Moderation extends Static {
    constructor(headers) {
        super(headers);
        this.bannedEvents = Events.prototype.banned;
        this.moderatorEvents = Events.prototype.moderator;
    }

    async bannedUsers(broadcaster_id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint("moderation/banned", { broadcaster_id, ...params });
    }

    async allBannedUsers(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "bannedUsers", params.limit);
    }

    async moderators(broadcaster_id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint("moderation/moderators", { broadcaster_id, ...params });
    }

    async allModerators(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "moderators", params.limit);
    }
};

module.exports = Moderation;