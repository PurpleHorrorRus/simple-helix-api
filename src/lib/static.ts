import {
	RawAxiosRequestHeaders,
	AxiosRequestConfig
} from "axios";

import axios from "axios";

export type TRequestConfig = AxiosRequestConfig & {
    ignoreStatus?: boolean
}

class Static {
	private root: string = "https://api.twitch.tv/helix";
	public headers: RawAxiosRequestHeaders;

	constructor (headers: RawAxiosRequestHeaders) {
		this.headers = headers;
	}

	async request(endpoint: string, data?: any, requestOptions: TRequestConfig = { method: "GET" }) {
		const response = await axios({
			url: `${this.root}/${endpoint}`,
			data,
			headers: this.headers as RawAxiosRequestHeaders,
			...requestOptions
		});

		const ok = response.status === 200
            || response.status === 202
            || response.status === 204;

		return (
			requestOptions.method !== "PATCH"
            && requestOptions.method !== "DELETE"
            && requestOptions.method !== "PUT") || requestOptions.ignoreStatus

			? ok
				? (response.data || ok)
				: this.handleError(response.statusText)

			: ok;
	}

	async requestEndpoint(
		endpoint: string,
		query?: Record<string, any>,
		method: string = "GET",
		data?: Record<string, any>
	) {
		if (query) {
			endpoint += "?" + (typeof query === "object"
				? new URLSearchParams(query).toString()
				: query);
		}

		return await this.request(endpoint, data, { method });
	}

	async getRequest(endpoint: string, query?: Record<string, any>) {
		return await this.requestEndpoint(endpoint, query);
	}

	async post(endpoint: string, query?: Record<string, any>, data?: Record<string, any>) {
		return await this.requestEndpoint(endpoint, query, "POST", data);
	}

	async put(endpoint: string, query?: Record<string, any>, data?: Record<string, any>) {
		return await this.requestEndpoint(endpoint, query, "PUT", data);
	}

	async patch(endpoint: string, query?: Record<string, any>, data?: Record<string, any>) {
		return await this.requestEndpoint(endpoint, query, "PATCH", data);
	}

	async delete(endpoint: string, query?: Record<string, any>, data?: Record<string, any>) {
		return await this.requestEndpoint(endpoint, query, "DELETE", data);
	}

	async requestAll(broadcaster_id: any | any[], context: any, builder: string, limit = Infinity, first = 100) {
		const request = async (params: any) => {
			if (typeof broadcaster_id === "object") {
				return Array.isArray(broadcaster_id)
					? await context[builder](...broadcaster_id, params)
					: await context[builder](broadcaster_id, params);
			}

			return await context[builder](broadcaster_id, params);
		};

		let response = await request({ first });
		let list: any[] = response.data || response;
		let cursor: string = response.pagination?.cursor;
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

	handleError (error: string): Error {
		throw new Error(error);
	}
}

export default Static;