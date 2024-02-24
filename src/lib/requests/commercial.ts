import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
	TCommercial
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
}

export default Commercial;