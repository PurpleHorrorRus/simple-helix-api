const Static = require("../static");

class Clips extends Static {
    constructor(headers) {
        super(headers);
        
        this.ERRORS = {
            ...this.ERRORS,
            CLIPS_REQUEST_LIMIT: "You can't fetch more than 100 clips per request"
        };
    }

    async create(broadcaster_id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint("clips", { broadcaster_id, ...params }, { method: "POST" });
    }
    
    async get(broadcaster_id, params = { first: 20 }) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (params.first > 100) {
            return this.handleError(this.ERRORS.CLIPS_REQUEST_LIMIT);
        }

        return await this.requestEndpoint("clips", {
            broadcaster_id,
            ...params
        }).catch(this.handleError);
    }

    async all(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "get", params.limit);
    }
};

module.exports = Clips;