import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Markers extends Static {
    constructor(headers: AxiosRequestHeaders);
    create(user_id: number, params?: {}): Promise<any>;
    get(user_id: number, video_id: number, params?: {}): Promise<any>;
}
export default Markers;
