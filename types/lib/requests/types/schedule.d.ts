import { TBroadcaster, TFirst, TPagination } from "./common";
type TVacation = {
    start_time: string;
    end_time: string;
};
export type TSegment = TVacation & {
    id: string;
    title: string;
    canceled_until: string | null;
    category: {
        id: string;
        name: string;
    };
    is_recurring: boolean;
};
export type TGetScheduleParams = Partial<TFirst & {
    id: string;
    start_time: string;
    utc_offset: string;
}>;
export type TGetScheduleResponseData = TBroadcaster & {
    segments: TSegment[];
    vacation: TVacation | null;
};
export type TGetScheduleResponse = {
    data: TGetScheduleResponseData;
    pagination: TPagination;
};
export type TScheduleParams = Partial<{
    duration: number;
    category_id: number;
    title: string;
}>;
export type TUpdateScheduleParams = Partial<{
    is_vacation_enabled: boolean;
    vacation_start_time: string;
    vacation_end_time: string;
    timezone: string;
}>;
export {};
