const Static = require("../static")

class Search extends Static {
    constructor(headers) {
        super(headers);
    }

    async categories(query, params = {}) {
        return await this.requestEndpoint("search/categories", { query, ...params });
    }

    async allCategories(query) {
        return await this.requestAll(query, this, "categories", params.limit);
    }

    async channels(query, params = {}) {
        return await this.requestEndpoint("search/channels", { query, ...params });
    }

    async allChannels(query, params = {}) {
        return await this.requestAll(query, this, "channels", params.limit);
    }
};

module.exports = Search;