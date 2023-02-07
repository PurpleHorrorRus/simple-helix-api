import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
    TGetTagsParams,
    TGetTagsResponse,
    TTag
} from "./types/tags";

class Tags extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async get(broadcaster_id: string): Promise<TGetTagsResponse> {
        return await this.getRequest("streams/tags", { broadcaster_id });
    }

    async replace(broadcaster_id: string, tag_ids: string[] | number[]) {
        if (tag_ids.length > 5) {
            tag_ids = tag_ids.slice(0, 5);
        }

        return await this.put("streams/tags", { broadcaster_id }, { tag_ids });
    }

    async getTags(params?: TGetTagsParams): Promise<TGetTagsResponse> {
        return await this.getRequest("tags/streams", params);
    }

    async all(limit = Infinity): Promise<TTag[]> {
        return await this.requestAll(1, this, "getTags", limit);
    }
}

export default Tags;