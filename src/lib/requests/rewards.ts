import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
    TGetRewardRedemptionParams,
    TGetRewardRedemptionsResponse,
    TGetRewardsParams,
    TReward,
    TRewardStatus
} from "./types/rewards";

class Rewards extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async get(broadcaster_id: string, params?: TGetRewardsParams): Promise<TGetRewardRedemptionsResponse> {
        return await this.getRequest("channel_points/custom_rewards", {
            broadcaster_id,
            ...params
        });
    }

    async create(
        broadcaster_id: string,
        title: string,
        cost: number,
        params?: Partial<TReward>
    ): Promise<TGetRewardRedemptionsResponse> {
        return await this.post("channel_points/custom_rewards", { broadcaster_id }, {
            title,
            cost,
            ...params
        });
    }

    async deleteReward(broadcaster_id: string, id: string) {
        return await this.delete("channel_points/custom_rewards", {
            broadcaster_id,
            id
        });
    }

    async update(broadcaster_id: string, id: string, reward?: Partial<TReward>): Promise<TReward> {
        return await this.patch("channel_points/custom_rewards", {
            broadcaster_id,
            id
        }, reward);
    }

    async all(broadcaster_id: string, limit = Infinity): Promise<TReward[]> {
        return await this.requestAll(broadcaster_id, this, "get", limit);
    }

    async redemption(
        broadcaster_id: string,
        reward_id: string,
        params?: TGetRewardRedemptionParams
    ): Promise<TGetRewardRedemptionsResponse> {
        return await this.getRequest("channel_points/custom_rewards/redemptions", {
            broadcaster_id,
            reward_id,
            ...params
        });
    }

    async updateRedemption(broadcaster_id: string, id: string, reward_id: string, status: TRewardStatus) {
        return await this.patch("channel_points/custom_rewards/redemptions", {
            broadcaster_id,
            id,
            reward_id
        }, { status });
    }
}

export default Rewards;