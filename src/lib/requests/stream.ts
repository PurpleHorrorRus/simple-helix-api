import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Stream extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
    }

    async key(broadcaster_id: number) {
        const { stream_key } = await this.requestCustom("streams/key", broadcaster_id);
        return stream_key;
    }

    async streams(params = {}) {
        return await this.requestEndpoint("streams", params);
    }

    async allStreams(limit = Infinity) {
        return await this.requestAll(1, this, "streams", limit);
    }

    async followedStreams(user_id: number, params = {}) {
        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        return await this.requestEndpoint("streams/followed", {
            user_id,
            ...params
        });
    }

    async allFollowedStreams(user_id: number, limit = Infinity) {
        return await this.requestAll(user_id, this, "followedStreams", limit);
    }
}

export default Stream;