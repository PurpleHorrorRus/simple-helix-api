import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TDeleteVideosResponse, TGetVideosParams, TGetVideosResponse, TVideo } from "./types/videos";
declare class Videos extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    get(params: TGetVideosParams): Promise<TGetVideosResponse>;
    all(fields: TGetVideosParams, limit?: number): Promise<TVideo[]>;
    deleteVideos(videos: string[] | number[]): Promise<TDeleteVideosResponse>;
}
export default Videos;
