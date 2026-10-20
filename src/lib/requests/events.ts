import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
	TEventsHypetrain,
	TEventsHypetrainParams,
	THypetrainStatusResponse
} from "./types/events";

class Events extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async hypetrainStatus(broadcaster_id: string): Promise<THypetrainStatusResponse> {
		return await this.getRequest("hypetrain/status", { broadcaster_id });
	}

	/**
	 * @deprecated Twitch decommissioned the hypetrain/events endpoint on 2026-01-22. Use hypetrainStatus instead.
	 */
	async hypetrain(broadcaster_id: string, params?: TEventsHypetrainParams): Promise<TEventsHypetrain> {
		return await this.getRequest("hypetrain/events", {
			broadcaster_id,
			...params
		});
	}
}

export default Events;