const Static = require("../static");

class Videos extends Static {
    constructor(headers) {
        super(headers);
        
        this.ERRORS = {
            ...this.ERRORS,
            MISSING_FIELDS: "You must specify one of these fields: id, user_id, game_id",
            INVALID_VIDEOS: "Videos object must be an non-empty array with videos IDs"
        };
    }

    async get(fields, params = {}) {
        if (!fields.id && !fields.user_id && !fields.game_id) {
            return this.handleError(this.ERRORS.MISSING_FIELDS);
        }

        return await this.requestEndpoint("videos", { ...fields, ...params });
    }

    async all(params) {
        return await this.requestAll(params, this, "get", params.limit);
    }

    async delete(videos) {
        if (!Array.isArray(videos)) {
            return this.handleError(this.ERRORS.INVALID_VIDEOS);
        }

        videos = videos.map(a => (`id=${a}`)).join("&");
        return await this.requestEndpoint("videos", videos, { method: "DELETE" });
    }
};

module.exports = Videos;