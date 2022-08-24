import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare type TOutcome = {
    title: string;
};
declare type TStatus = "ACTIVE" | "RESOLVED" | "CANCELED" | "LOCKED";
declare class Predictions extends Static {
    constructor(headers: AxiosRequestHeaders);
    /**
    * Check poll limitations: https://dev.twitch.tv/docs/api/reference#create-prediction
    */
    create(broadcaster_id: number, title: string, outcomes: TOutcome[], prediction_window?: number): Promise<any>;
    end(broadcaster_id: number, id: number, status: TStatus, winning_outcome_id?: number): Promise<any>;
    get(broadcaster_id: number, params?: {}): Promise<any>;
    all(broadcaster_id: number, limit?: number): Promise<any>;
}
export default Predictions;
