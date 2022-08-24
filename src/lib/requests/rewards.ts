import { AxiosRequestHeaders } from "axios";

import Static from "../static";

type TReward = {
    title: string
    cost: number
};

class Rewards extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_TITLE_OR_COST: "You must to specify title and cost of custom reward",
            MISSING_REWARD_ID: "You must to specify reward ID",
            MISSING_STATUS: "Status field is missing"
        };
    }

    async get(broadcaster_id: number, params = {}) {
        return await this.requestCustom("channel_points/custom_rewards", broadcaster_id, params);
    }

    async create(broadcaster_id: number, title: string, cost: number, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!title || cost === undefined) {
            return this.handleError(this.ERRORS.MISSING_TITLE_OR_COST);
        }

        const [reward] = await this.requestEndpoint("channel_points/custom_rewards", { broadcaster_id }, {
            method: "POST",
            data: {
                title,
                cost,
                ...params
            }
        });

        return reward;
    }

    async delete(broadcaster_id: number, id: number) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_REWARD_ID);
        }

        return await this.requestEndpoint("channel_points/custom_rewards", { broadcaster_id, id }, { method: "DELETE" });
    }

    async update(broadcaster_id: number, id: number, reward: TReward) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_REWARD_ID);
        }

        if (!reward.title || !reward.cost) {
            return this.handleError(this.ERRORS.MISSING_TITLE_OR_COST);
        }

        return await this.requestEndpoint("channel_points/custom_rewards", { broadcaster_id, id }, {
            method: "PATCH",
            data: reward
        });
    }

    async redemption(broadcaster_id: number, reward_id: number, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!reward_id) {
            return this.handleError(this.ERRORS.MISSING_REWARD_ID);
        }

        return await this.requestEndpoint(
            "channel_points/custom_rewards/redemptions", 
            { broadcaster_id, reward_id, ...params }
        );
    }

    async all(broadcaster_id: number, limit = Infinity) {
        return await this.requestAll(broadcaster_id, this, "get", limit);
    }

    async updateRedemption(broadcaster_id: number, id: number, reward_id: number, status: "FULFILLED" | "CANCELED") {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!reward_id) {
            return this.handleError(this.ERRORS.MISSING_REWARD_ID);
        }

        if (!status) {
            return this.handleError(this.ERRORS.MISSING_STATUS);
        }

        return await this.requestEndpoint("channel_points/custom_rewards/redemptions", {
            broadcaster_id,
            id,
            reward_id
        }, { 
            method: "PATCH",
            data: { status }
        });
    }
};

export default Rewards;