import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Subscriptions extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
    }

    async broadcaster(broadcaster_id: number, params = {}) {
        return await this.requestCustom("subscriptions", broadcaster_id, params);
    }

    async allBroadcaster(broadcaster_id: number, limit = Infinity) {
        return await this.requestAll(broadcaster_id, this, "broadcaster", limit);
    }

    async checkUser(broadcaster_id: number, user_id: number) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!user_id) {
            return this.handleError(this.ERRORS.MISSING_USER_ID);
        }

        return await this.requestEndpoint("subscriptions/user", {
            broadcaster_id,
            user_id
        });
    }
}

export default Subscriptions;