const Static = require("../static");

const scheduleConfig = {
    MAX_TITLE_LENGTH: 140
};

class Schedule extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_FIELDS: "You must specify all required time fields",
            MISSING_ID: "Schedule segment ID is missing"
        };
    }

    async create(broadcaster_id, time, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!time.start_time || !time.timezone || !time.is_recurring) {
            return this.handleError(this.ERRORS.MISSING_FIELDS);
        }

        if (params.title && params.title.length > scheduleConfig.MAX_TITLE_LENGTH) {
            params.title = params.title.substring(0, scheduleConfig.MAX_TITLE_LENGTH);
        }

        return await this.requestEndpoint("schedule/segment", { broadcaster_id }, {
            method: "POST",
            body: { ...time, ...params }
        });
    }

    async update(broadcaster_id, id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_ID);
        }

        if (params.title && params.title.length > scheduleConfig.MAX_TITLE_LENGTH) {
            params.title = params.title.substring(0, scheduleConfig.MAX_TITLE_LENGTH);
        }

        return await this.requestEndpoint("schedule/segment", { broadcaster_id, id }, {
            method: "PATCH",
            body: params
        });
    }

    async delete(broadcaster_id, id) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_ID);
        }

        return await this.requestEndpoint("schedule/segment", { broadcaster_id, id }, { method: "DELETE" });
    }

    async updateSchedule(broadcaster_id, params = {}) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (params.is_vacation_enabled && (
                !params.vacation_start_time ||
                !params.vacation_end_time ||
                !params.timezone)) return this.handleError(this.ERRORS.MISSING_FIELDS);
        
        return await this.requestEndpoint("schedule/settings", { broadcaster_id, ...params }, { method: "PATCH" });
    }

    async get(broadcaster_id, params = {}) {
        return await this.requestCustom("schedule", broadcaster_id, params);
    }

    async calendar(broadcaster_id) {
        return await this.requestCustom("schedule/icalendar", broadcaster_id);
    }

    async all(broadcaster_id, params = {}) {
        return await this.requestAll(broadcaster_id, this, "get", params.limit);
    }
};

module.exports = Schedule;