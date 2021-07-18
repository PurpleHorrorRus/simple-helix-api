const Static = require("../static");

class Games extends Static {
    constructor(headers) {
        super(headers);
    }

    async getByID(id) {
        return await this.requestEndpoint("games", { id });
    }

    async getByName(name) {
        return await this.requestEndpoint("games", { name });
    }

    async get(game) {
        return Number(game) ? await this.getByID(game) : await this.getByName(game);
    }

    async top(params = {}) {
        return await this.requestEndpoint("games/top", params);
    }
};

module.exports = Games;