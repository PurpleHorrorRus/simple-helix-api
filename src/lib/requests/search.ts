import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import { TFirst } from "./types/common";
import {
	TSearchCategoriesResponse,
	TSearchCategory,
	TSearchChannel,
	TSearchChannelsParams,
	TSearchChannelsResponse
} from "./types/search";

class Search extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async categories(query: string, params?: TFirst): Promise<TSearchCategoriesResponse> {
		return await this.getRequest("search/categories", {
			query,
			...params
		});
	}

	async allCategories(query: string, limit = Infinity): Promise<TSearchCategory[]> {
		return await this.requestAll(query, this, "categories", limit);
	}

	async channels(query: string, params?: TSearchChannelsParams): Promise<TSearchChannelsResponse> {
		return await this.getRequest("search/channels", {
			query,
			...params
		});
	}

	async allChannels(query: string, limit = Infinity): Promise<TSearchChannel[]> {
		return await this.requestAll(query, this, "channels", limit);
	}
}

export default Search;