import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TEndPollStatus, TGetPollsParams, TGetPollsResponse, TPoll, TPollChoice } from "./types/polls";
declare class Polls extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    create(broadcaster_id: string, title: string, choices: TPollChoice[], duration?: number): Promise<TPoll>;
    end(broadcaster_id: string, id: string, status?: TEndPollStatus): Promise<TPoll>;
    get(broadcaster_id: string, params?: TGetPollsParams): Promise<TGetPollsResponse>;
    all(broadcaster_id: string, limit?: number): Promise<TPoll[]>;
}
export default Polls;
