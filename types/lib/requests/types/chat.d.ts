import { TPagination } from "./common";
type TEmoteFormat = "static" | "animated";
type TEmoteScale = "1.0" | "2.0" | "3.0";
type TEmoteMode = "light" | "dark";
export type TEmote = {
    id: string;
    name: string;
    images: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
    };
    format: TEmoteFormat[];
    scale: TEmoteScale[];
    theme_mode: TEmoteMode[];
};
type TBadgeVersion = {
    click_action: string | null;
    click_url: string | null;
    description: string;
    id: string;
    image_url_1x: string;
    image_url_2x: string;
    image_url_4x: string;
    title: string;
};
export type TBadge = {
    set_id: string;
    versions: TBadgeVersion[];
};
export type TColor = "blue" | "green" | "orange" | "purple" | "primary";
export type TUserColor = "blue" | "blue_violet" | "cadet_blue" | "chocolate" | "coral" | "dodger_blue" | "firebrick" | "golden_rod" | "green" | "hot_pink" | "orange_red" | "red" | "sea_green" | "spring_green" | "yellow_green";
export type TUser = {
    user_id: string;
    user_name: string;
    user_login: string;
};
export type TColorResponse = TUser & {
    color: string;
};
export type TChatSettings = {
    broadcaster_id: string;
    slow_mode: boolean;
    slow_mode_wait_time: number | null;
    follower_mode: boolean;
    follower_mode_duration: number;
    subscriber_mode: boolean;
    emote_mode: boolean;
    unique_chat_mode: boolean;
    non_moderator_chat_delay: boolean;
    non_moderator_chat_delay_duration: number;
};
export type TChattersResponse = {
    data: TUser[];
    pagination: TPagination;
    total: number;
};
export type TSendChatMessageResponse = {
    data: {
        message_id: string;
        is_sent: boolean;
        drop_reason: {
            code: string;
            message: string;
        } | null;
    }[];
};
export type TSharedChatParticipant = {
    broadcaster_id: string;
};
export type TSharedChatSession = {
    session_id: string;
    host_broadcaster_id: string;
    participants: TSharedChatParticipant[];
    created_at: string;
    updated_at: string;
};
export type TSharedChatSessionResponse = {
    data: TSharedChatSession[];
};
export type TUserEmote = TEmote & {
    emote_type: "subscriptions" | "bitstier" | "follower" | string;
    emote_set_id: string;
    owner_id: string;
};
export type TUserEmotesResponse = {
    data: TUserEmote[];
    template: string;
    pagination: TPagination;
};
export {};
