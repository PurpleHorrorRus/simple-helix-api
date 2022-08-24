import axios, { AxiosRequestHeaders, AxiosRequestConfig } from "axios";

export type TRequestConfig = AxiosRequestConfig & {
    ignoreStatus?: boolean
}

class Static {
    headers: AxiosRequestHeaders;

    ERRORS: {
        [x: string]: string
    } = {
        MISSING_BROADCASTER_ID: "You must to specify broadcaster_id",
        MISSING_MODERATOR_ID: "You must to specify moderator_id"
    }

    constructor (headers: AxiosRequestHeaders) {
        this.headers = headers;
    }

    async request(url: string, data?: any, requestOptions: TRequestConfig = { method: "GET" }) {
        const response = await axios({
            url,
            data,
            headers: this.headers,
            ...requestOptions
        });

        return (
            requestOptions.method !== "PATCH"
            && requestOptions.method !== "DELETE"
            && requestOptions.method !== "PUT") || requestOptions.ignoreStatus

            ? response.status === 200
                ? response.data
                : this.handleError(response.statusText)

            : (response.status === 200 || response.status === 204);
    }

    async requestEndpoint(endpoint: string, data?: any, requestOptions?: AxiosRequestConfig) {
        const query: string = typeof data === "object"
            ? new URLSearchParams(data).toString()
            : data

        const response = await this.request(`https://api.twitch.tv/helix/${endpoint}?${query}`, undefined, requestOptions)
            .catch(this.handleError);

        return response.pagination?.cursor || !response.data 
            ? response 
            : response.data.length === 1 
                ? response.data[0] 
                : response.data;
    }

    async requestAll(broadcaster_id: any | any[], context: any, builder: string, limit = Infinity, first = 100) {
        const request = async (params: any) => {
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

    async requestCustom(endpoint: string, broadcaster_id: number, params = {}, requestOptions: TRequestConfig = { method: "GET" }) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint(endpoint, {
            broadcaster_id,
            ...params
        }, requestOptions);
    }

    handleError (error: string) {
        throw new Error(error);
    }
};

export default Static;