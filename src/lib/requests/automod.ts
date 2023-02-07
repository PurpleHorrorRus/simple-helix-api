import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import { TAutomodSettings } from "./types/automod";

class Automod extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async settings(broadcaster_id: string, moderator_id?: string): Promise<TAutomodSettings> {
        return await this.getRequest("moderation/automod/settings", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id
        });
    }

    async update(broadcaster_id: string, settings: Partial<TAutomodSettings>, moderator_id?: string) {
        return await this.put("moderation/automod/settings", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id
        }, settings);
    }
}

export default Automod;