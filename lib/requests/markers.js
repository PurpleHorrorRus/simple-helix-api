const Static = require("../static");

class Markers extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_VIDEO_ID: "Missing video ID"
        };
    }

    async create(user_id, params = {}) {
        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        return await this.requestEndpoint("streams/markers", {}, {
            method: "POST",
            body: { user_id, ...params }
        });
    }

    async get(user_id, video_id, params = {}) {
        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        if (!video_id) {
            return this.handleError(this.ERRORS.MISSING_VIDEO_ID);
        }

        return await this.requestEndpoint("streams/markers", { user_id, video_id, ...params });
    }
};

module.exports = Markers;