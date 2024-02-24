import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TGetScheduleParams, TGetScheduleResponse, TGetScheduleResponseData, TScheduleParams, TSegment, TUpdateScheduleParams } from "./types/schedule";
declare class Schedule extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    create(broadcaster_id: string, segment: TSegment, params: TScheduleParams): Promise<any>;
    update(broadcaster_id: string, id: string, params: TScheduleParams): Promise<any>;
    deleteSegment(broadcaster_id: string, id: string): Promise<any>;
    updateSchedule(broadcaster_id: string, params?: TUpdateScheduleParams): Promise<any>;
    get(broadcaster_id: string, params?: TGetScheduleParams): Promise<TGetScheduleResponse>;
    calendar(broadcaster_id: string): Promise<string>;
    all(broadcaster_id: string, limit?: number): Promise<TGetScheduleResponseData[]>;
}
export default Schedule;
