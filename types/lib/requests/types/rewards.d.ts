import { TFirst, TList } from "./common";
export type TGetRewardsParams = Partial<{
    id: string;
    only_manageable_rewards: boolean;
}>;
export type TRewardBasic = {
    id: string;
    title: string;
    prompt: string;
    cost: number;
};
export type TReward = TRewardBasic & {
    broadcaster_name: string;
    broadcaster_login: string;
    broadcaster_id: string;
    image: string | null;
    background_color: string;
    is_enabled: boolean;
    is_user_input_required: boolean;
    max_per_stream_setting: {
        is_enabled: boolean;
        max_per_stream: number;
    };
    max_per_user_per_stream_setting: {
        is_enabled: boolean;
        max_per_user_per_stream: number;
    };
    global_cooldown_setting: {
        is_enabled: boolean;
        global_cooldown_seconds: number;
    };
    is_paused: boolean;
    is_in_stock: boolean;
    default_image: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
    };
    should_redemptions_skip_request_queue: boolean;
    redemptions_redeemed_current_stream: number | null;
    cooldown_expires_at: string | null;
};
export type TRewardStatus = "CANCELED" | "FULFILLED" | "UNFULFILLED";
export type TGetRewardResponse = TList & {
    data: TReward;
};
export type TGetRewardRedemptionsResponse = TList & {
    data: TReward[];
};
export type TGetRewardRedemptionParams = Partial<TFirst> & {
    broadcaster_id: string;
    reward_id: string;
    status: TRewardStatus;
    id?: string;
    sort?: "OLDEST" | "NEWEST";
};
