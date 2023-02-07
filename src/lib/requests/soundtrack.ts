import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import { TFirst } from "./types/common";

import {
    TCurrentTrackResponse,
    TPlaylistResponse,
    TPlaylistsResponse
} from "./types/soundtrack";

class Soundtrack extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async track(broadcaster_id: string): Promise<TCurrentTrackResponse> {
        return await this.getRequest("soundtrack/current_track", { broadcaster_id });
    }

    async playlist(id: string, params?: TFirst): Promise<TPlaylistResponse> {
        return await this.getRequest("soundtrack/playlist", {
            id,
            ...params
        });
    }

    async playlists(): Promise<TPlaylistsResponse> {
        return await this.getRequest("soundtrack/playlists");
    }
}

export default Soundtrack;