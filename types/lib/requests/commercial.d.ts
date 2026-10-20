import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TAdScheduleResponse, TCommercial, TSnoozeNextAdResponse } from "./types/commercial";
declare class Commercial extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    start(broadcaster_id: string, length?: number): Promise<TCommercial>;
    adSchedule(broadcaster_id: string): Promise<TAdScheduleResponse>;
    snoozeNextAd(broadcaster_id: string): Promise<TSnoozeNextAdResponse>;
}
export default Commercial;
