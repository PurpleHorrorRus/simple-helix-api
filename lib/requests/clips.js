const Static = require("../static");

class Clips extends Static {
    constructor(headers) {
        super(headers);
    }

    async create(broadcaster_id, params = {}) {
        return await this.requestCustom("clips", broadcaster_id, params, { method: "POST" });
    }
    
    async get(broadcaster_id, params = { first: 20 }) {
        if (params.first) params.first = Math.max(Math.min(params.first, 100), 0);
        return await this.requestCustom("clips", broadcaster_id, params);
    }

    async all(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "get", params.limit);
    }
};

module.exports = Clips;