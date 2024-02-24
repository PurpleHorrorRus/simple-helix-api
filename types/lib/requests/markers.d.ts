import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TCreateMarkerParams, TGetMarkersParams, TGetMarkersResponse, TMarker } from "./types/markers";
declare class Markers extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    create(user_id: string, params?: TCreateMarkerParams): Promise<TMarker>;
    get(user_id: string, video_id: number, params?: TGetMarkersParams): Promise<TGetMarkersResponse[]>;
}
export default Markers;
