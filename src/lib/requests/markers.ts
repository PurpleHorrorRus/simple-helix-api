import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
    TCreateMarkerParams,
    TGetMarkersParams,
    TGetMarkersResponse,
    TMarker
} from "./types/markers";

class Markers extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async create(user_id: string, params?: TCreateMarkerParams): Promise<TMarker> {
        return await this.post("streams/markers", { user_id }, params);
    }

    async get(user_id: string, video_id: number, params?: TGetMarkersParams): Promise<TGetMarkersResponse[]> {
        return await this.getRequest("streams/markers", {
            user_id,
            video_id,
            ...params
        });
    }
}

export default Markers;