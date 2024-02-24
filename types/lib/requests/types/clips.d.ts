import { TDate, TFirstBefore, TList } from "./common";
export type TClip = {
    id: string;
    url: string;
    embed_url: string;
    broadcaster_id: string;
    broadcaster_name: string;
    creator_id: string;
    creator_name: string;
    video_id: string;
    game_id: string;
    language: string;
    title: string;
    view_count: number;
    created_at: string;
    thumbnail_url: string;
    duration: string;
    vod_offset: string;
};
export type TGetClipResponse = TList & {
    data: TClip[];
};
export type TCreateClipParams = {
    has_delay?: boolean;
};
export type TCreatedClip = {
    id: string;
    edit_url: string;
};
export type TGetClipsParams = Partial<TFirstBefore & TDate & {
    game_id: string;
    id: string;
}>;
