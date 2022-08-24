import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Subscriptions extends Static {
    constructor(headers: AxiosRequestHeaders);
    broadcaster(broadcaster_id: number, params?: {}): Promise<any>;
    allBroadcaster(broadcaster_id: number, limit?: number): Promise<any>;
    checkUser(broadcaster_id: number, user_id: number): Promise<any>;
}
export default Subscriptions;
