import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Events extends Static {
    constructor(headers: AxiosRequestHeaders);
    hypetrain(broadcaster_id: number, params?: {}): Promise<any>;
    banned(broadcaster_id: number, params?: {}): Promise<any>;
    moderator(broadcaster_id: number, params?: {}): Promise<any>;
}
export default Events;
