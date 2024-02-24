import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
	TBitsAnaylticsResponse,
	TCheermotes,
	TExtensionAnalyticsResponse,
	TGameAnalytics,
	TGetBitsAnalyticsParams,
	TGetCheermotesParams,
	TGetExtensionAnalyticsParams,
	TGetExtensionTransactionsParams,
	TGetGameAnalyticsParams
} from "./types/analytics";

class Analytics extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async extension(data: TGetExtensionAnalyticsParams): Promise<TExtensionAnalyticsResponse> {
		return await this.getRequest("analytics/extensions", data);
	}

	async game(data: TGetGameAnalyticsParams): Promise<TGameAnalytics[]> {
		return await this.getRequest("analytics/games", data);
	}

	async bits(data?: TGetBitsAnalyticsParams): Promise<TBitsAnaylticsResponse> {
		return await this.getRequest("bits/leaderboard", data);
	}

	async cheermotes(data?: TGetCheermotesParams): Promise<TCheermotes[]> {
		return await this.getRequest("bits/cheermotes", data);
	}

	async extensionTransactions(
		extension_id: number,
		data: TGetExtensionTransactionsParams
	): Promise<TExtensionAnalyticsResponse> {
		return await this.getRequest("extensions/transactions", {
			extension_id,
			...data
		});
	}
}

export default Analytics;