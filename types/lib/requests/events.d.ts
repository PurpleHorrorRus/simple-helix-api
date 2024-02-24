import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TEventsHypetrain, TEventsHypetrainParams } from "./types/events";
declare class Events extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    hypetrain(broadcaster_id: string, params?: TEventsHypetrainParams): Promise<TEventsHypetrain>;
}
export default Events;
