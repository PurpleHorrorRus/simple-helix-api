import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
	TGetPredictionsParams,
	TGetPredictionsResponse,
	TPrediction,
	TPredictionOutcome,
	TPredictionStatus
} from "./types/predictions";

// Do not change this values. 
const predictionsConfig = {
	MAX_TITLE_LENGTH: 45,

	OUTCOMES_MIN: 2,
	OUTCOMES_MAX: 10,
	OUTCOMES_ITEM_TITLE_LENGTH: 25,

	MIN_TIMEOUT: 1,
	MAX_TIMEOUT: 1800
};

class Predictions extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async create(
		broadcaster_id: string,
		title: string,
		outcomes: TPredictionOutcome[],
		prediction_window = predictionsConfig.MIN_TIMEOUT
	): Promise<TPrediction> {
		return await this.post("predictions", {}, {
			broadcaster_id,

			title: title.substring(0, predictionsConfig.MAX_TITLE_LENGTH),

			outcomes: outcomes.map(o => ({
				title: o.title.substring(0, predictionsConfig.OUTCOMES_ITEM_TITLE_LENGTH)
			})),

			prediction_window: Math.max(
				Math.min(prediction_window, predictionsConfig.MAX_TIMEOUT),
				predictionsConfig.MIN_TIMEOUT
			)
		});
	}

	async end(
		broadcaster_id: string,
		id: string, status: TPredictionStatus,
		winning_outcome_id: string | null
	): Promise<TPrediction> {
		const results: any = { id, status };

		if (status === "RESOLVED") {
			results.winning_outcome_id = winning_outcome_id;
		}

		return await this.patch("predictions", {}, {
			broadcaster_id,
			...results
		});
	}

	async get(broadcaster_id: string, params?: TGetPredictionsParams): Promise<TGetPredictionsResponse> {
		return await this.getRequest("predictions", {
			broadcaster_id,
			...params
		});
	}

	async all(broadcaster_id: string, limit = Infinity): Promise<TPrediction[]> {
		return await this.requestAll(broadcaster_id, this, "get", limit, 20);
	}
}

export default Predictions;