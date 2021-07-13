const Static = require("../static");

// Do not change this values. 
const predictionsConfig = {
    MAX_TITLE_LENGTH: 45,

    OUTCOMES_ITEM_TITLE_LENGTH: 25,

    MIN_TIMEOUT: 1,
    MAX_TIMEOUT: 1800
};

class Predictions extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_TITLE: "Invalid prediction title",
            OUTCOMES_LENGTH: "Prediction must contain two outcomes",
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
     async create(broadcaster_id, title, outcomes, prediction_window = predictionsConfig.MIN_TIMEOUT) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!title) {
            return this.handleError(this.ERRORS.INVALID_TITLE);
        }

        if (!Array.isArray(outcomes)) {
            return this.handleError(this.ERRORS.INVALID_OUTCOME);
        }

        if (outcomes.length !== 2) {
            return this.handleError(this.ERRORS.OUTCOMES_LENGTH);
        }

        if (~outcomes.findIndex(item => !item.title)) {
            return this.handleError(this.ERRORS.INVALID_OUTCOME_ITEM);
        };

        title = title.substring(0, predictionsConfig.MAX_TITLE_LENGTH);

        outcomes = outcomes.map(o => ({
            title: o.title.substring(0, predictionsConfig.OUTCOMES_ITEM_TITLE_LENGTH)
        }));

        prediction_window = Math.max(Math.min(prediction_window, predictionsConfig.MAX_TIMEOUT), predictionsConfig.MIN_TIMEOUT);

        return await this.requestEndpoint("predictions", {}, {
            method: "POST",
            body: {
                broadcaster_id,
                title,
                outcomes,
                prediction_window
            }
        });
    }

    async end(broadcaster_id, id, status, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_ID);
        }

        if (!status) {
            return this.handleError(this.ERRORS.MISSING_STATUS);
        }

        if (status === "RESOLVED" && !params.winning_outcome_id) {
            return this.handleError(this.ERRORS.MISSING_RESOLVED_OUTCOME_ID);
        }

        if (status !== "RESOLVED" && params.winning_outcome_id) {
            return this.handleError(this.ERRORS.STATUS_OUTCOME_MISMATCH);
        }

        const results = {
            broadcaster_id,
            id,
            status
        };

        if (status === "RESOLVED") {
            results.winning_outcome_id = params.winning_outcome_id;
        }

        return await this.requestEndpoint("predictions", {}, {
            method: "PATCH",
            body: results
        });
    }

    async get(broadcaster_id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        return await this.requestEndpoint("predictions", { broadcaster_id, ...params });
    }

    async all(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "get", params.limit);
    }
};

module.exports = Predictions;