const fetch = require("node-fetch");
const { encode } = require("querystring");

class Static {
    constructor (headers) {
        this.headers = headers;

        this.ERRORS = {
            MISSING_BROADCASTER_ID: "You must to specify broadcaster_id",
            MISSING_USER_ID: "You must to specify user_id"
        }
    }

    async request (url, params = {}) {
        const response = await fetch(url, params);
        return params.method !== "PATCH" && params.method !== "DELETE" && params.method !== "PUT"
            ? response.status === 200 ? await response.json() : new Error(response.statusText)
            : response.status === 204;
    }

    async requestEndpoint (endpoint, query = {}, params = {}) {
        if (typeof query === "object") {
            query = encode(query);
        }

        if (params.body) {
            params.body = JSON.stringify(params.body);
        }

        const response = await this.request(`https://api.twitch.tv/helix/${endpoint}?${query}`, {
            headers: this.headers,
            ...params
        }).catch(this.handleError);

        return response.pagination?.cursor || !response.data 
            ? response 
            : response.data.length === 1 
                ? response.data[0] 
                : response.data;
    }

    async requestAll(broadcaster_id, context, builder, limit = Infinity) {
        let response = await context[builder](broadcaster_id, { first: 100 });
        let list = response.data || response;
        let cursor = response.pagination?.cursor;
        const isNotInfinity = limit !== Infinity;

        let iter = Number(isNotInfinity);
        while (cursor !== undefined && iter < limit) {
            response = await context[builder](broadcaster_id, {
                first: 100,
                after: cursor
            });
            
            list = [...list, ...(response.data || response)];
            cursor = response.pagination?.cursor;
            
            if (isNotInfinity) {
                iter++;
            }
        }

        return list;
    }

    async requestGet(endpoint, broadcaster_id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint(endpoint, { broadcaster_id, ...params });
    }

    handleError (error) {
        throw new Error(error);
    }
};

module.exports = Static;