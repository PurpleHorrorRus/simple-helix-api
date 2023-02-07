import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
    TEventsHypetrain,
    TEventsHypetrainParams
} from "./types/events";

class Events extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async hypetrain(broadcaster_id: string, params?: TEventsHypetrainParams): Promise<TEventsHypetrain> {
        return await this.getRequest("hypetrain/events", {
            broadcaster_id,
            ...params
        });
    }
}

export default Events;