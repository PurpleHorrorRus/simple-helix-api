const Static = require("../static");

class Games extends Static {
    constructor(headers) {
        super(headers);
    }

    async top(params = {}) {
        return await this.requestEndpoint("games/top", params);
    }

    async get(idName) {
        const params = {};
        Number(idName) ? params.id = idName : params.name = idName;
        return await this.requestEndpoint("games", params);
    }
};

module.exports = Games;