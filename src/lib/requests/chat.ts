import { AxiosRequestHeaders } from "axios";

import Static from "../static";

type TColor = "blue"
    | "green"
    | "orange"
    | "purple"
    | "primary";

type TUserColor = "blue"
    | "blue_violet"
    | "cadet_blue"
    | "chocolate"
    | "coral"
    | "dodger_blue"
    | "firebrick"
    | "golden_rod"
    | "green"
    | "hot_pink"
    | "orange_red"
    | "red"
    | "sea_green"
    | "spring_green"
    | "yellow_green"

class Chat extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
        
        this.ERRORS = {
            ...this.ERRORS,
            MISSING_EMOTE_SET_ID: "You must to specify emote_set_id",
            INVALID_SETTINGS: "Settings object is invalid",
            MISSING_MESSAGE_ID: "You must to specify message_id"
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

    async announcement(broadcaster_id: number, moderator_id: number, message: string, color: TColor = "primary") { 
        return await this.requestEndpoint("chat/announcements", {
            broadcaster_id,
            moderator_id
        }, {
            method: "POST",
            data: {
                message: message.substring(0, 500),
                color
            }
        });
    }

    async badges(broadcaster_id: number) {
        return await this.requestCustom("chat/badges", broadcaster_id);
    }

    async delete(broadcaster_id: number, moderator_id: number, message_id: string) {
        return await this.requestEndpoint("moderation/chat", {
            broadcaster_id,
            moderator_id,
            message_id
        });
    }

    async color(user_id: number) {
        const response = await this.requestEndpoint("chat/color", {
            user_id
        });

        return response.color; 
    }

    async updateColor(user_id: number, color: TUserColor) { 
        return await this.requestEndpoint("chat/color", {
            user_id,
            color
        }, { method: "PUT" });
    }

    async settings(broadcaster_id: number, moderator_id?: number) {
        const params = moderator_id ? { moderator_id } : undefined;
        return await this.requestCustom("chat/settings", broadcaster_id, params);
    }

    async updateSettings(broadcaster_id: number, moderator_id: number, settings: any) {
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