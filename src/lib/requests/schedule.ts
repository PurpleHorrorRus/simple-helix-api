import { AxiosRequestHeaders } from "axios";

import Static from "../static";

const scheduleConfig = {
    MAX_TITLE_LENGTH: 140
};

type TSegment = {
    start_time: string // Start time for the scheduled broadcast specified in RFC3339 format.
    timezone: string // The timezone of the application creating the scheduled broadcast using the IANA time zone database format.
    is_recurring: boolean // Indicates if the scheduled broadcast is recurring weekly.
};

type TScheduleParams = Partial<{
    duration: number
    category_id: number
    title: string
}>;

type TUpdateScheduleParams = Partial<{
    is_vacation_enabled: boolean
    vacation_start_time: string
    vacation_end_time: string
    timezone: string
}>;

class Schedule extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_FIELDS: "You must specify all required time fields",
            MISSING_ID: "Schedule segment ID is missing"
        };
    }

    async create(broadcaster_id: number, segment: TSegment, params: TScheduleParams) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!segment.start_time || !segment.timezone || !segment.is_recurring) {
            return this.handleError(this.ERRORS.MISSING_FIELDS);
        }

        if (params.title && params.title.length > scheduleConfig.MAX_TITLE_LENGTH) {
            params.title = params.title.substring(0, scheduleConfig.MAX_TITLE_LENGTH);
        }

        return await this.requestEndpoint("schedule/segment", { broadcaster_id }, {
            method: "POST",

            data: {
                ...segment,
                ...params
            }
        });
    }

    async update(broadcaster_id: number, id: number, params: TScheduleParams) {
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
            data: params
        });
    }

    async delete(broadcaster_id: number, id: number) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (!id) {
            return this.handleError(this.ERRORS.MISSING_ID);
        }

        return await this.requestEndpoint("schedule/segment", {
            broadcaster_id,
            id
        }, { method: "DELETE" });
    }

    async updateSchedule(broadcaster_id: number, params: TUpdateScheduleParams) {
        if (!broadcaster_id) {
            return this.handleError(this.ERRORS.MISSING_BROADCASTER_ID);
        }

        if (params.is_vacation_enabled && (
                !params.vacation_start_time ||
                !params.vacation_end_time ||
                !params.timezone)) return this.handleError(this.ERRORS.MISSING_FIELDS);
        
        return await this.requestEndpoint("schedule/settings", { 
            broadcaster_id,
            ...params
        }, { method: "PATCH" });
    }

    async get(broadcaster_id: number, params = {}) {
        return await this.requestCustom("schedule", broadcaster_id, params);
    }

    async calendar(broadcaster_id: number) {
        return await this.requestCustom("schedule/icalendar", broadcaster_id);
    }

    async all(broadcaster_id: number, limit = Infinity) {
        return await this.requestAll(broadcaster_id, this, "get", limit);
    }
};

export default Schedule;