import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Clips extends Static {
    constructor(headers: AxiosRequestHeaders);
    create(broadcaster_id: number, params?: {}): Promise<any>;
    get(broadcaster_id: number, params?: {
        first: number;
    }): Promise<any>;
    all(broadcaster_id: number, limit: number): Promise<any>;
}
export default Clips;
