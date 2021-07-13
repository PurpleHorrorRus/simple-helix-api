const Static = require("../static");

class Rewards extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_TITLE_OR_COST: "You must to specify title and cost of custom reward",
            MISSING_REWARD_ID: "You must to specify reward ID",
            MISSING_STATUS: "Status field is missing"
        };
    }

    async get(broadcaster_id, params = {}) {
        return await this.requestCustom("channel_points/custom_rewards", broadcaster_id, params);
    }

    async create(broadcaster_id, title, cost, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!title || cost === undefined) {
            return this.handleError(this.ERRORS.MISSING_TITLE_OR_COST);
        }

        const [reward] = await this.requestEndpoint("channel_points/custom_rewards", { broadcaster_id }, {
            method: "POST",
            body: {
                title,
                cost,
                ...params
            }
        });

        return reward;
    }

    async delete(broadcaster_id, id) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_REWARD_ID);
        }

        return await this.requestEndpoint("channel_points/custom_rewards", { broadcaster_id, id }, { method: "DELETE" });
    }

    async update(broadcaster_id, id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_REWARD_ID);
        }

        if (!params.title || !params.cost) {
            return this.handleError(this.ERRORS.MISSING_TITLE_OR_COST);
        }

        return await this.requestEndpoint("channel_points/custom_rewards", { broadcaster_id, id }, {
            method: "PATCH",
            body: params
        });
    }

    async redemption(broadcaster_id, reward_id, params = {}) {
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

    async all(broadcaster_id, reward_id, params = {}) {
        let redemptions = [];
        let cursor = "";

        while (cursor !== undefined) {
            const response = await this.getRedemption(broadcaster_id, reward_id, {
                ...params,
                after: cursor,
                first: 50
            });

            redemptions = [...redemptions, ...response.data];
            cursor = response.pagination?.cursor;
        }
        
        return redemptions;
    }

    async updateRedemption(broadcaster_id, id, reward_id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!reward_id) {
            return this.handleError(this.ERRORS.MISSING_REWARD_ID);
        }

        if (!params.status) {
            return this.handleError(this.ERRORS.MISSING_STATUS);
        }

        return await this.requestEndpoint(
            "channel_points/custom_rewards/redemptions",
            { broadcaster_id, id, reward_id },
            { 
                method: "PATCH",
                body: params
            }
        );
    }
};

module.exports = Rewards;