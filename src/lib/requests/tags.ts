import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Tags extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_TAG_IDS: "tag_ids must be an array"
        };
    }

    async get(broadcaster_id: number) {
        return await this.requestCustom("streams/tags", broadcaster_id);
    }

    async replace(broadcaster_id: number, tag_ids: string[] | number[]) {
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
            data: { tag_ids }
        });
    }

    async getTags(params = {}) {
        return await this.requestEndpoint("tags/streams", params);
    }

    async all(limit = Infinity) {
        return await this.requestAll(1, this, "getTags", limit);
    }
};

export default Tags;