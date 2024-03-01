import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TGetPredictionsParams, TGetPredictionsResponse, TPrediction, TPredictionOutcome, TPredictionStatus } from "./types/predictions";
declare class Predictions extends Static {
	constructor(headers: RawAxiosRequestHeaders);
	create(broadcaster_id: string, title: string, outcomes: TPredictionOutcome[], prediction_window?: number): Promise<TPrediction>;
	end(broadcaster_id: string, id: string, status: TPredictionStatus, winning_outcome_id: string | null): Promise<TPrediction>;
	get(broadcaster_id: string, params?: TGetPredictionsParams): Promise<TGetPredictionsResponse>;
	all(broadcaster_id: string, limit?: number): Promise<TPrediction[]>;
}
export default Predictions;
