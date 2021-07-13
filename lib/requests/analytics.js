const Static = require("../static");

class Analytics extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_EXTENSION_ID: "You must to specify extension_id"
        };
    }

    async extension(params = {}) {
        return await this.requestEndpoint("analytics/extensions", params);
    }

    async game(params = {}) {
        return await this.requestEndpoint("analytics/games", params);
    }

    async bits(params = {}) {
        return await this.requestEndpoint("bits/leaderboard", params);
    }

    async cheermotes(params = {}) {
        return await this.requestEndpoint("bits/cheermotes", params);
    }

    async extensionTransactions(extension_id, params = {}) {
        if (!extension_id) {
            return this.handleError(this.ERRORS.MISSING_EXTENSION_ID);
        }

        return await this.requestEndpoint("extensions/transactions", { extension_id, ...params });
    }
};

module.exports = Analytics;