const fetch = require("node-fetch");

class Static {
    constructor (headers) {
        this.headers = headers;

        this.ERRORS = {
            MISSING_BROADCASTER_ID: "You must to specify broadcaster_id",
            MISSING_MODERATOR_ID: "You must to specify moderator_id",
            MISSING_USER_ID: "You must to specify user_id"
        }
    }

    async request(url, params = {}) {
        const response = await fetch(url, params);
        return (params.method !== "PATCH" && params.method !== "DELETE" && params.method !== "PUT") || params.ignoreStatus
            ? response.status === 200 ? await response.json() : this.handleError(response.statusText)
            : response.status === 204;
    }

    async requestEndpoint(endpoint, query = {}, params = {}) {
        if (typeof query === "object") {
            query = new URLSearchParams(query).toString();
        }

        if (params.body && typeof params.body === "object") {
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

    async requestAll(broadcaster_id, context, builder, limit = Infinity, first = 100) {
        const request = async params => {
            if (typeof broadcaster_id === "object") {
                return Array.isArray(broadcaster_id)
                    ? await context[builder](...broadcaster_id, params)
                    : await context[builder](broadcaster_id, params);
            }

            return await context[builder](broadcaster_id, params);
        }

        let response = await request({ first });
        let list = response.data || response;
        let cursor = response.pagination?.cursor;
        const isNotInfinity = limit !== Infinity;

        let iter = Number(isNotInfinity);
        while (cursor !== undefined && iter < limit) {
            response = await request({
                first: 100,
                after: cursor
            });
            
            list = [...list, ...(response?.data ?? (Array.isArray(response) ? response : [response]))];
            cursor = response.pagination?.cursor;
            
            if (isNotInfinity) {
                iter++;
            }
        }

        return list;
    }

    async requestCustom(endpoint, broadcaster_id, params = {}, requestOptions = { method: "GET" }) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint(endpoint, {
            broadcaster_id,
            ...params
        }, requestOptions);
    }

    handleError (error) {
        throw new Error(error);
    }
};

module.exports = Static;