import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare type Choice = {
    title: string;
};
declare class Polls extends Static {
    constructor(headers: AxiosRequestHeaders);
    /**
    * Check poll limitations: https://dev.twitch.tv/docs/api/reference#create-poll
    */
    create(broadcaster_id: number, title: string, choices: Choice[], duration?: number): Promise<any>;
    end(broadcaster_id: number, id: number, status?: "ARCHIVED" | "TERMINATED"): Promise<any>;
    get(broadcaster_id: number, params?: {}): Promise<any>;
    all(broadcaster_id: number, limit?: number): Promise<any>;
}
export default Polls;
