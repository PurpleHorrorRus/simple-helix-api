import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TFirst } from "./types/common";
import { TGetStreamsParams, TGetStreamsResponse, TStream } from "./types/stream";
declare class Stream extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    key(broadcaster_id: string): Promise<string>;
    streams(params?: TGetStreamsParams): Promise<TGetStreamsResponse>;
    all(limit?: number): Promise<TStream[]>;
    followed(user_id: string, params?: TFirst): Promise<TGetStreamsResponse>;
    allFollowed(user_id: string, limit?: number): Promise<TStream[]>;
}
export default Stream;
