import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
    TChannel,
    TEditor,
    TGetVipsRequestParams,
    TGetVipsResponse,
} from "./types/channel";

import { TUser } from "./types/chat";

class Channel extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async get(broadcaster_id: string | string[]): Promise<TChannel | TChannel[]> {
        if (Array.isArray(broadcaster_id)) {
            const broadcaster_ids = broadcaster_id.map(id => {
                return `broadcaster_id=${id}`;
            }).join("&");

            return await this.getRequest("channels", { broadcaster_ids });
        }

        return await this.getRequest("channels", { broadcaster_id });
    }

    async modify(
        broadcaster_id: string,
        game_id: string = "",
        broadcaster_language: string = "en",
        title: string,
        delay: number = 0
    ): Promise<TChannel> {
        return await this.patch("channels", { broadcaster_id }, {
            game_id,
            broadcaster_language,
            title,
            ...(delay ? { delay } : {}) // Notice: delay works only for Twitch partners
        });
    }

    async editors(broadcaster_id: string): Promise<TEditor[]> {
        return await this.getRequest("channels/editors", { broadcaster_id });
    }

    async addVip(broadcaster_id: string, user_id: string) {
        return await this.post("channels/vips", { broadcaster_id }, { user_id });
    }

    async removeVip(broadcaster_id: string, user_id: string) {
        return await this.delete("channels/vips", { broadcaster_id }, { user_id });
    }

    async vips(broadcaster_id: string, params?: TGetVipsRequestParams): Promise<TGetVipsResponse> { 
        return await this.getRequest("channels/vips", {
            broadcaster_id,
            ...params
        });
    }

    async allVips(broadcaster_id: string, limit = Infinity): Promise<TUser[]> { 
        return await this.requestAll(broadcaster_id, this, "vips", limit);
    }

    async whisper(from_user_id: number, to_user_id: number, message: string) {
        return await this.post("whispers", {
            from_user_id,
            to_user_id
        }, { message });
    }
}

export default Channel;