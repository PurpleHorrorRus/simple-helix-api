import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Stream extends Static {
    constructor(headers: AxiosRequestHeaders);
    key(broadcaster_id: number): Promise<any>;
    streams(params?: {}): Promise<any>;
    allStreams(limit?: number): Promise<any>;
    followedStreams(user_id: number, params?: {}): Promise<any>;
    allFollowedStreams(user_id: number, limit?: number): Promise<any>;
}
export default Stream;
