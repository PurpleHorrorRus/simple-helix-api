import { AxiosRequestHeaders } from "axios";

import Static from "../static";

enum ERRORS { 
    MISSING_EXTENSION_ID = "You must to specify extension_id"
};

class Analytics extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
    }

    async extension(data = {}) {
        return await this.requestEndpoint("analytics/extensions", data);
    }

    async game(data = {}) {
        return await this.requestEndpoint("analytics/games", data);
    }

    async bits(data = {}) {
        return await this.requestEndpoint("bits/leaderboard", data);
    }

    async cheermotes(data = {}) {
        return await this.requestEndpoint("bits/cheermotes", data);
    }

    async extensionTransactions(extension_id: number, data = {}) {
        if (!extension_id) {
            return this.handleError(ERRORS.MISSING_EXTENSION_ID);
        }

        return await this.requestEndpoint("extensions/transactions", { extension_id, ...data });
    }
};

export default Analytics;