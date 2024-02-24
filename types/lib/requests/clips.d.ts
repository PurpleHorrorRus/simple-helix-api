import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TClip, TCreateClipParams, TCreatedClip, TGetClipResponse, TGetClipsParams } from "./types/clips";
declare class Clips extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    create(broadcaster_id: string, params?: TCreateClipParams): Promise<TCreatedClip[]>;
    get(broadcaster_id: string, params?: TGetClipsParams): Promise<TGetClipResponse>;
    all(broadcaster_id: string, limit: number): Promise<TClip[]>;
}
export default Clips;
