import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Clips extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
    }

    async create(broadcaster_id: number, params = {}) {
        return await this.requestCustom("clips", broadcaster_id, params, { method: "POST" });
    }
    
    async get(broadcaster_id: number, params = { first: 20 }) {
        params.first = Math.max(Math.min(params.first, 100), 0);
        return await this.requestCustom("clips", broadcaster_id, params);
    }

    async all(broadcaster_id: number, limit: number) {
        return await this.requestAll(broadcaster_id, this, "get", limit);
    }
};

export default Clips;