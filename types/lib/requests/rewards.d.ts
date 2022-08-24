import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare type TReward = {
    title: string;
    cost: number;
};
declare class Rewards extends Static {
    constructor(headers: AxiosRequestHeaders);
    get(broadcaster_id: number, params?: {}): Promise<any>;
    create(broadcaster_id: number, title: string, cost: number, params?: {}): Promise<any>;
    delete(broadcaster_id: number, id: number): Promise<any>;
    update(broadcaster_id: number, id: number, reward: TReward): Promise<any>;
    redemption(broadcaster_id: number, reward_id: number, params?: {}): Promise<any>;
    all(broadcaster_id: number, limit?: number): Promise<any>;
    updateRedemption(broadcaster_id: number, id: number, reward_id: number, status: "FULFILLED" | "CANCELED"): Promise<any>;
}
export default Rewards;
