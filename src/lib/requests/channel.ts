import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Channel extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            EMPTY_TITLE_OR_GAME_ID: "You must to specify the title and game_id of stream"
        };
    }

    async get(broadcaster_id: (string | number)[]) {
        if (Array.isArray(broadcaster_id)) {
            const broadcaster_ids = broadcaster_id.map(id => {
                return `broadcaster_id=${id}`;
            }).join("&");

            return await this.requestEndpoint("channels", broadcaster_ids, { method: "GET" });
        }

        return await this.requestCustom("channels", broadcaster_id);
    }

    async modify(broadcaster_id: number, game_id: string = "", broadcaster_language: string = "en", title: string, delay: number = 0) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!title || !game_id) {
            return this.handleError(this.ERRORS.EMPTY_TITLE_OR_GAME_ID);
        }

        return await this.requestEndpoint("channels", { broadcaster_id }, {
            method: "PATCH",
            data: {
                game_id,
                broadcaster_language,
                title,
                ...delay ? { delay } : {} // Notice: delay works only for partners
            }
        });
    }

    async editors(broadcaster_id: number) {
        return await this.requestCustom("channels/editors", broadcaster_id);
    }

    async addVip(broadcaster_id: number, user_id: number) {
        return await this.requestEndpoint("channels/vips", {
            broadcaster_id,
            user_id
        }, { method: "POST" });
    }

    async removeVip(broadcaster_id: number, user_id: number) {
        return await this.requestEndpoint("channels/vips", {
            broadcaster_id,
            user_id
        }, { method: "DELETE" });
    }

    async vips(broadcaster_id: number, params = {}) { 
        return await this.requestEndpoint("channels/vips", {
            broadcaster_id,
            ...params
        });
    }

    async allVips(broadcaster_id: number, limit = Infinity) { 
        return await this.requestAll(broadcaster_id, this, "vips", limit);
    }

    async whisper(from_user_id: number, to_user_id: number, message: string) {
        return await this.requestEndpoint("whispers", {
            from_user_id,
            to_user_id
        }, { 
            method: "POST",
            data: { message }
        })
    }
}

export default Channel;