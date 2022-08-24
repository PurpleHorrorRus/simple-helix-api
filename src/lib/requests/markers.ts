import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Markers extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_VIDEO_ID: "Missing video ID"
        };
    }

    async create(user_id: number, params = {}) {
        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        return await this.requestEndpoint("streams/markers", undefined, {
            method: "POST",

            data: {
                user_id,
                ...params
            }
        });
    }

    async get(user_id: number, video_id: number, params = {}) {
        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        if (!video_id) {
            return this.handleError(this.ERRORS.MISSING_VIDEO_ID);
        }

        return await this.requestEndpoint("streams/markers", { user_id, video_id, ...params });
    }
};

export default Markers;