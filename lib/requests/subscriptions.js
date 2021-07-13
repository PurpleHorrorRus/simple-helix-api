const Static = require("../static")

class Subscriptions extends Static {
    constructor(headers) {
        super(headers);
    }

    async broadcaster(broadcaster_id, params = {}) {
        return await this.requestGet("subscriptions", broadcaster_id, params);
    }

    async allBroadcaster(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "broadcaster", params.limit);
    }

    async checkUser(broadcaster_id, user_id) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        return await this.requestEndpoint("subscriptions/user", { broadcaster_id, user_id });
    }
};

module.exports = Subscriptions;