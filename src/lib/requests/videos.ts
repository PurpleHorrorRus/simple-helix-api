import { AxiosRequestHeaders } from "axios";

import Static from "../static";

type TGetVideoFields = Partial<{
    id: number
    user_id: number
    game_id: number
}>;

class Videos extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
        
        this.ERRORS = {
            ...this.ERRORS,
            MISSING_FIELDS: "You must specify one of these fields: id, user_id, game_id",
            INVALID_VIDEOS: "Videos object must be an non-empty array with videos IDs"
        };
    }

    async get(fields: TGetVideoFields, params = {}) {
        if (!fields.id && !fields.user_id && !fields.game_id) {
            return this.handleError(this.ERRORS.MISSING_FIELDS);
        }

        return await this.requestEndpoint("videos", {
            ...fields,
            ...params
        });
    }

    async all(fields: TGetVideoFields, limit = Infinity) {
        return await this.requestAll(fields, this, "get", limit);
    }

    async delete(videos: string[] | number[]) {
        if (!Array.isArray(videos)) {
            return this.handleError(this.ERRORS.INVALID_VIDEOS);
        }

        const video_ids = videos.map(a => (`id=${a}`)).join("&");
        return await this.requestEndpoint("videos", video_ids, {
            method: "DELETE"
        });
    }
};

export default Videos;