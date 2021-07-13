const Static = require("../static");

class Tags extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_TAG_IDS: "tag_ids must be an array"
        };
    }

    async get(broadcaster_id) {
        return await this.requestGet("streams/tags", broadcaster_id, {});
    }

    async replace(broadcaster_id, tag_ids) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!Array.isArray(tag_ids)) {
            return this.handleError(this.ERRORS.INVALID_TAG_IDS);
        }

        if (tag_ids.length > 5) {
            tag_ids = tag_ids.splice(0, 5);
        }

        return await this.requestEndpoint("streams/tags", { broadcaster_id }, {
            method: "PUT",
            body: { tag_ids }
        });
    }

    async getTags(params = {}) {
        return await this.requestEndpoint("tags/streams", params);
    }

    async all(params = {}) {
        return await this.requestAll(1, this, "getTags", params.limit);
    }
};

module.exports = Tags;