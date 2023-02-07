import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
    TClip,
    TCreateClipParams,
    TCreatedClip,
    TGetClipResponse,
    TGetClipsParams
} from "./types/clips";

class Clips extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async create(broadcaster_id: string, params?: TCreateClipParams): Promise<TCreatedClip[]> {
        return await this.post("clips", { broadcaster_id }, params);
    }
    
    async get(broadcaster_id: string, params?: TGetClipsParams): Promise<TGetClipResponse> {
        return await this.getRequest("clips", {
            broadcaster_id,
            ...params,
            first: Math.max(Math.min(params?.first ?? 20, 100), 0)
        });
    }

    async all(broadcaster_id: string, limit: number): Promise<TClip[]> {
        return await this.requestAll(broadcaster_id, this, "get", limit);
    }
}

export default Clips;