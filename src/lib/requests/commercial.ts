import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
	TAdScheduleResponse,
	TCommercial,
	TSnoozeNextAdResponse
} from "./types/commercial";

class Commercial extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async start(broadcaster_id: string, length = 30): Promise<TCommercial> {
		return await this.post("channels/commercial", { broadcaster_id }, {
			length: Math.max(Math.min(length, 180), 30)
		});
	}

	async adSchedule(broadcaster_id: string): Promise<TAdScheduleResponse> {
		return await this.getRequest("channels/ads", { broadcaster_id });
	}

	async snoozeNextAd(broadcaster_id: string): Promise<TSnoozeNextAdResponse> {
		return await this.post("channels/ads/schedule/snooze", { broadcaster_id });
	}
}

export default Commercial;