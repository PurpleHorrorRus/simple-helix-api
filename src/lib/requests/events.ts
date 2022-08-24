import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Events extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
    }

    async hypetrain(broadcaster_id: number, params = {}) {
        return await this.requestCustom("hypetrain/events", broadcaster_id, params);
    }

    async banned(broadcaster_id: number, params = {}) {
        return await this.requestCustom("moderation/banned", broadcaster_id, params);
    }

    async moderator(broadcaster_id: number, params = {}) {
        return await this.requestCustom("moderation/moderators", broadcaster_id, params);
    }
};

export default Events;