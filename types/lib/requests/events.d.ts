import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TEventsHypetrain, TEventsHypetrainParams, THypetrainStatusResponse } from "./types/events";
declare class Events extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    hypetrainStatus(broadcaster_id: string): Promise<THypetrainStatusResponse>;
    /**
     * @deprecated Twitch decommissioned the hypetrain/events endpoint on 2026-01-22. Use hypetrainStatus instead.
     */
    hypetrain(broadcaster_id: string, params?: TEventsHypetrainParams): Promise<TEventsHypetrain>;
}
export default Events;
