import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TCheckUserResponse, TGetSubscriptionsParams, TGetSubscriptionsResponse, TSubscriber } from "./types/subscriptions";
declare class Subscriptions extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    broadcaster(broadcaster_id: string, params?: TGetSubscriptionsParams): Promise<TGetSubscriptionsResponse>;
    allBroadcaster(broadcaster_id: string, limit?: number): Promise<TSubscriber[]>;
    checkUser(broadcaster_id: string, user_id: string): Promise<TCheckUserResponse>;
}
export default Subscriptions;
