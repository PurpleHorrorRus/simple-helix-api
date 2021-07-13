const Static = require("../static");

class Stream extends Static {
    constructor(headers) {
        super(headers);
    }

    async key(broadcaster_id) {
        const { stream_key } = await this.requestCustom("streams/key", broadcaster_id);
        return stream_key;
    }

    async streams(params = {}) {
        return await this.requestEndpoint("streams", params);
    }

    async allStreams(params = {}) {
        return await this.requestAll(1, this, "streams", params.limit);
    }

    async followedStreams(user_id, params = {}) {
        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        return await this.requestEndpoint("streams/followed", { user_id, ...params });
    }

    async allFollowedStreams(user_id, params = {}) {
        return await this.requestAll(user_id, this, "followedStreams", params.limit);
    }
};

module.exports = Stream;