import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Search extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
    }

    async categories(query: string, params = {}) {
        return await this.requestEndpoint("search/categories", {
            query,
            ...params
        });
    }

    async allCategories(query: string, limit = Infinity) {
        return await this.requestAll(query, this, "categories", limit);
    }

    async channels(query: string, params = {}) {
        return await this.requestEndpoint("search/channels", {
            query,
            ...params
        });
    }

    async allChannels(query: string, limit = Infinity) {
        return await this.requestAll(query, this, "channels", limit);
    }
};

export default Search;