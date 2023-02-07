import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";
import { TFirst } from "./types/common";

import {
    TGetStreamsParams,
    TGetStreamsResponse,
    TStream
} from "./types/stream";

class Stream extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async key(broadcaster_id: string): Promise<string> {
        const response = await this.getRequest("streams/key", { broadcaster_id });
        return response?.stream_key;
    }

    async streams(params?: TGetStreamsParams): Promise<TGetStreamsResponse> {
        return await this.getRequest("streams", params);
    }

    async all(limit = Infinity): Promise<TStream[]> {
        return await this.requestAll(1, this, "streams", limit);
    }

    async followed(user_id: string, params?: TFirst): Promise<TGetStreamsResponse> {
        return await this.getRequest("streams/followed", {
            user_id,
            ...params
        });
    }

    async allFollowed(user_id: string, limit = Infinity): Promise<TStream[]> {
        return await this.requestAll(user_id, this, "followedStreams", limit);
    }
}

export default Stream;