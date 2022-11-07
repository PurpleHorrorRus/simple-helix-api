import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Other extends Static {
    constructor(headers: AxiosRequestHeaders);
    getViewers(user: string): Promise<any>;
    chatters(broadcaster_id: number, moderator_id: number, params?: {}): Promise<any>;
    allChatters(broadcaster_id: number, moderator_id: number): Promise<any>;
}
export default Other;
