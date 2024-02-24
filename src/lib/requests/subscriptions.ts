import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
	TCheckUserResponse,
	TGetSubscriptionsParams,
	TGetSubscriptionsResponse,
	TSubscriber
} from "./types/subscriptions";

class Subscriptions extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async broadcaster(broadcaster_id: string, params?: TGetSubscriptionsParams): Promise<TGetSubscriptionsResponse> {
		return await this.getRequest("subscriptions", {
			broadcaster_id,
			...params
		});
	}

	async allBroadcaster(broadcaster_id: string, limit = Infinity): Promise<TSubscriber[]> {
		return await this.requestAll(broadcaster_id, this, "broadcaster", limit);
	}

	async checkUser(broadcaster_id: string, user_id: string): Promise<TCheckUserResponse> {
		return await this.getRequest("subscriptions/user", {
			broadcaster_id,
			user_id
		});
	}
}

export default Subscriptions;