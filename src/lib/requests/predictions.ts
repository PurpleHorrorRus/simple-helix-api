import { AxiosRequestHeaders } from "axios";

import Static from "../static";

// Do not change this values. 
const predictionsConfig = {
    MAX_TITLE_LENGTH: 45,

    OUTCOMES_MIN: 2,
    OUTCOMES_MAX: 10,
    OUTCOMES_ITEM_TITLE_LENGTH: 25,
    
    MIN_TIMEOUT: 1,
    MAX_TIMEOUT: 1800
};

type TOutcome = {
    title: string;
};

type TStatus = "ACTIVE" | "RESOLVED" | "CANCELED" | "LOCKED";

class Predictions extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_TITLE: "Invalid prediction title",
            OUTCOMES_MIN: "Prediction must have at least 2 outcomes",
            OUTCOMES_MAX: "Preidction can have a maximum of 10 outcomes",
            INVALID_OUTCOME: "Outcomes must be an array",
            INVALID_OUTCOME_ITEM: "One of choise items is invalid",
            MISSING_ID: "Missing prediction ID",
            MISSING_STATUS: "You must to specify status of prediction",
            MISSING_RESOLVED_OUTCOME_ID: "You must to specify outcome ID with RESOLVED status",
            STATUS_OUTCOME_MISMATCH: "You can choose winning outcome only with RESOLVED status"
        };
    }

    /**
    * Check poll limitations: https://dev.twitch.tv/docs/api/reference#create-prediction
    */
     async create(broadcaster_id: number, title: string, outcomes: TOutcome[], prediction_window = predictionsConfig.MIN_TIMEOUT) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!title) {
            return this.handleError(this.ERRORS.INVALID_TITLE);
        }

        if (!Array.isArray(outcomes)) {
            return this.handleError(this.ERRORS.INVALID_OUTCOME);
        }
         
         if (outcomes.length < predictionsConfig.OUTCOMES_MIN) { 
            return this.handleError(this.ERRORS.OUTCOMES_MIN);
        }

        if (outcomes.length > predictionsConfig.OUTCOMES_MAX) {
            return this.handleError(this.ERRORS.OUTCOMES_MAX);
        }

        if (outcomes.some(item => !item.title)) {
            return this.handleError(this.ERRORS.INVALID_OUTCOME_ITEM);
        }

        outcomes = outcomes.map(o => ({
            title: o.title.substring(0, predictionsConfig.OUTCOMES_ITEM_TITLE_LENGTH)
        }));

        return await this.requestEndpoint("predictions", {}, {
            method: "POST",

            data: {
                broadcaster_id,
                title: title.substring(0, predictionsConfig.MAX_TITLE_LENGTH),
                outcomes,
                prediction_window: Math.max(
                    Math.min(prediction_window, predictionsConfig.MAX_TIMEOUT),
                    predictionsConfig.MIN_TIMEOUT
                )
            }
        });
    }

    async end(broadcaster_id: number, id: number, status: TStatus, winning_outcome_id?: number) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_ID);
        }

        if (!status) {
            return this.handleError(this.ERRORS.MISSING_STATUS);
        }

        if (status === "RESOLVED" && !winning_outcome_id) {
            return this.handleError(this.ERRORS.MISSING_RESOLVED_OUTCOME_ID);
        }

        if (status !== "RESOLVED" && winning_outcome_id) {
            return this.handleError(this.ERRORS.STATUS_OUTCOME_MISMATCH);
        }

        const results: any = {
            broadcaster_id,
            id,
            status
        };

        if (status === "RESOLVED") {
            results.winning_outcome_id = winning_outcome_id;
        }

        return await this.requestEndpoint("predictions", {}, {
            method: "PATCH",
            data: results
        });
    }

    async get(broadcaster_id: number, params = {}) {
        return await this.requestCustom("predictions", broadcaster_id, params);
    }

    async all(broadcaster_id: number, limit = Infinity) {
        return await this.requestAll(broadcaster_id, this, "get", limit, 20);
    }
}

export default Predictions;