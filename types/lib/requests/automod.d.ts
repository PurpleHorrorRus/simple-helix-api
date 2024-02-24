import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TAutomodSettings } from "./types/automod";
declare class Automod extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    settings(broadcaster_id: string, moderator_id?: string): Promise<TAutomodSettings>;
    update(broadcaster_id: string, settings: Partial<TAutomodSettings>, moderator_id?: string): Promise<any>;
}
export default Automod;
