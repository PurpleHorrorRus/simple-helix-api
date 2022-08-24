import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare type TSegment = {
    start_time: string;
    timezone: string;
    is_recurring: boolean;
};
declare type TScheduleParams = Partial<{
    duration: number;
    category_id: number;
    title: string;
}>;
declare type TUpdateScheduleParams = Partial<{
    is_vacation_enabled: boolean;
    vacation_start_time: string;
    vacation_end_time: string;
    timezone: string;
}>;
declare class Schedule extends Static {
    constructor(headers: AxiosRequestHeaders);
    create(broadcaster_id: number, segment: TSegment, params: TScheduleParams): Promise<any>;
    update(broadcaster_id: number, id: number, params: TScheduleParams): Promise<any>;
    delete(broadcaster_id: number, id: number): Promise<any>;
    updateSchedule(broadcaster_id: number, params: TUpdateScheduleParams): Promise<any>;
    get(broadcaster_id: number, params?: {}): Promise<any>;
    calendar(broadcaster_id: number): Promise<any>;
    all(broadcaster_id: number, limit?: number): Promise<any>;
}
export default Schedule;
