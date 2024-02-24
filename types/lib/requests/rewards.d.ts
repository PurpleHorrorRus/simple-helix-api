import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TGetRewardRedemptionParams, TGetRewardRedemptionsResponse, TGetRewardsParams, TReward, TRewardStatus } from "./types/rewards";
declare class Rewards extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    get(broadcaster_id: string, params?: TGetRewardsParams): Promise<TGetRewardRedemptionsResponse>;
    create(broadcaster_id: string, title: string, cost: number, params?: Partial<TReward>): Promise<TGetRewardRedemptionsResponse>;
    deleteReward(broadcaster_id: string, id: string): Promise<any>;
    update(broadcaster_id: string, id: string, reward?: Partial<TReward>): Promise<TReward>;
    all(broadcaster_id: string, limit?: number): Promise<TReward[]>;
    redemption(broadcaster_id: string, reward_id: string, params?: TGetRewardRedemptionParams): Promise<TGetRewardRedemptionsResponse>;
    updateRedemption(broadcaster_id: string, id: string, reward_id: string, status: TRewardStatus): Promise<any>;
}
export default Rewards;
