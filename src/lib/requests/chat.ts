import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Chat extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
        
        this.ERRORS = {
            ...this.ERRORS,
            MISSING_EMOTE_SET_ID: "You must to specify emote_set_id",
            INVALID_SETTINGS: "Settings object is invalid"
        };
    }

    async globalEmotes() {
        return await this.requestCustom("chat/emotes/global", 0);
    }

    async emotes(broadcaster_id: number) {
        return await this.requestCustom("chat/emotes", broadcaster_id);
    }

    async emoteSets(emote_set_id: number) {
        if (!emote_set_id) {
            return this.handleError(this.ERRORS.MISSING_EMOTE_SET_ID);
        }

        return await this.requestEndpoint("helix/chat/emotes/set", { emote_set_id });
    }

    async globalBadges() {
        return await this.requestEndpoint("chat/badges/global");
    }

    async badges(broadcaster_id: number) {
        return await this.requestCustom("chat/badges", broadcaster_id);
    }

    async settings(broadcaster_id: number, moderator_id?: number) {
        const params = moderator_id ? { moderator_id } : undefined;
        return await this.requestCustom("chat/settings", broadcaster_id, params);
    }

    async updateSettings(broadcaster_id: number, moderator_id: number, settings: any) {
        if (!moderator_id) {
            return this.handleError(this.ERRORS.MISSING_MODERATOR_ID);
        }

        if (!(settings instanceof Object) || Object.keys(settings).length === 0) {
            return this.handleError(this.ERRORS.INVALID_SETTINGS);
        }

        if ("follower_mode_duration" in settings) {
            // Limit followers mode duration
            settings.follower_mode_duration = Math.min(Math.max(0, settings.follower_mode_duration), 129600);
        }

        if ("slow_mode_wait_time" in settings) {
            // Limit slow mode messages wait time
            settings.slow_mode_wait_time = Math.min(Math.max(3, settings.slow_mode_wait_time), 120);
        }

        return await this.requestCustom("chat/settings", broadcaster_id, { moderator_id }, {
            method: "PATCH",
            data: settings,
            ignoreStatus: true
        });
    }
}

export default Chat;