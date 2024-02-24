import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import { 
	TGetScheduleParams,
	TGetScheduleResponse,
	TGetScheduleResponseData,
	TScheduleParams,
	TSegment,
	TUpdateScheduleParams
} from "./types/schedule";

const scheduleConfig = {
	MAX_TITLE_LENGTH: 140
};

class Schedule extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async create(broadcaster_id: string, segment: TSegment, params: TScheduleParams) {
		if (params.title && params.title.length > scheduleConfig.MAX_TITLE_LENGTH) {
			params.title = params.title.substring(0, scheduleConfig.MAX_TITLE_LENGTH);
		}

		return await this.post("schedule/segment", { broadcaster_id }, {
			...segment,
			...params
		});
	}

	async update(broadcaster_id: string, id: string, params: TScheduleParams) {
		if (params.title && params.title.length > scheduleConfig.MAX_TITLE_LENGTH) {
			params.title = params.title.substring(0, scheduleConfig.MAX_TITLE_LENGTH);
		}

		return await this.patch("schedule/segment", { broadcaster_id, id }, params);
	}

	async deleteSegment(broadcaster_id: string, id: string) {
		return await this.delete("schedule/segment", {
			broadcaster_id,
			id
		});
	}

	async updateSchedule(broadcaster_id: string, params?: TUpdateScheduleParams) {
		return await this.patch("schedule/settings", {
			broadcaster_id,
			...params
		});
	}

	async get(broadcaster_id: string, params?: TGetScheduleParams): Promise<TGetScheduleResponse> {
		return await this.getRequest("schedule", {
			broadcaster_id,
			...params
		});
	}

	async calendar(broadcaster_id: string): Promise<string> {
		return await this.getRequest("schedule/icalendar", { broadcaster_id });
	}

	async all(broadcaster_id: string, limit = Infinity): Promise<TGetScheduleResponseData[]> {
		return await this.requestAll(broadcaster_id, this, "get", limit);
	}
}

export default Schedule;