import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Tags extends Static {
    constructor(headers: AxiosRequestHeaders);
    get(broadcaster_id: number): Promise<any>;
    replace(broadcaster_id: number, tag_ids: string[] | number[]): Promise<any>;
    getTags(params?: {}): Promise<any>;
    all(limit?: number): Promise<any>;
}
export default Tags;
