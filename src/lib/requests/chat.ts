import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
    TBadge,
    TChatSettings,
    TChattersResponse,
    TColor,
    TColorResponse,
    TEmote,
    TUser,
    TUserColor
} from "./types/chat";

import { TFirst } from "./types/common";

class Chat extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async chatters(broadcaster_id: string, params?: TFirst, moderator_id?: string): Promise<TChattersResponse> {
        return await this.getRequest("chat/chatters", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id,
            ...params
        });
    }

    async allChatters(broadcaster_id: string, limit = Infinity, moderator_id?: string): Promise<TUser[]> {
        return await this.requestAll([
            broadcaster_id,
            {},
            moderator_id || broadcaster_id
        ], this, "chatters", limit, 1000);
    }

    async globalEmotes(): Promise<TEmote[]> {
        return await this.getRequest("chat/emotes/global");
    }

    async emotes(broadcaster_id: string): Promise<TEmote[]> {
        return await this.getRequest("chat/emotes", { broadcaster_id });
    }

    async emoteSets(emote_set_id: number): Promise<TEmote[] > {
        return await this.getRequest("helix/chat/emotes/set", { emote_set_id });
    }

    async globalBadges(): Promise<TBadge[]> {
        return await this.getRequest("chat/badges/global");
    }

    async announcement(broadcaster_id: string, moderator_id: string, message: string, color: TColor = "primary") {
        return await this.post("chat/announcements", {
            broadcaster_id,
            moderator_id
        }, {
            message: message.substring(0, 500),
            color
        });
    }

    async shoutout(broadcaster_id: string, to_broadcaster_id: string, moderator_id?: string) {
        return await this.post("chat/shoutouts", {
            broadcaster_id,
            to_broadcaster_id,
            moderator_id: moderator_id || broadcaster_id
        });
    }

    async badges(broadcaster_id: string): Promise<TBadge[]> {
        return await this.getRequest("chat/badges", { broadcaster_id });
    }

    async deleteMessage(broadcaster_id: string, moderator_id: string, message_id: string) {
        return await this.delete("moderation/chat", {
            broadcaster_id,
            moderator_id,
            message_id
        });
    }

    async color(user_id: string): Promise<TColorResponse> {
        const response = await this.getRequest("chat/color", { user_id });
        return response.color; 
    }

    async updateColor(user_id: string, color: TUserColor) { 
        return await this.put("chat/color", {
            user_id,
            color
        });
    }

    async settings(broadcaster_id: string, moderator_id?: number): Promise<TChatSettings> {
        return await this.getRequest("chat/settings", {
            broadcaster_id,
            moderator_id: moderator_id || broadcaster_id
        });
    }

    async updateSettings(broadcaster_id: string, moderator_id: string, settings: Partial<TChatSettings>): Promise<TChatSettings> {
        if (settings.follower_mode_duration) {
            // Limit followers mode duration
            settings.follower_mode_duration = Math.min(Math.max(0, settings.follower_mode_duration), 129600);
        }

        if (settings.slow_mode_wait_time) {
            // Limit slow mode messages wait time
            settings.slow_mode_wait_time = Math.min(Math.max(3, settings.slow_mode_wait_time), 120);
        }

        return await this.patch("chat/settings", {
            broadcaster_id,
            moderator_id
        }, settings);
    }
}

export default Chat;