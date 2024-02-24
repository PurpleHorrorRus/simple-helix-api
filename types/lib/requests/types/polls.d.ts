import { TFirst, TList } from "./common";
export type TPollStatus = "ACTIVE" | "COMPLETED" | "TERMINATED" | "ARCHIVED" | "MODERATED" | "INVALID";
export type TEndPollStatus = "ARCHIVED" | "TERMINATED";
type TPollChoiceNative = {
    id: string;
    title: string;
    votes: number;
    chanel_points_votes: number;
    bits_votes: number;
};
export type TPollChoice = {
    title: string;
};
export type TPoll = {
    id: string;
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    title: string;
    choices: TPollChoiceNative[];
    bits_voting_enabled: boolean;
    bits_per_vote: number;
    channel_points_voting_enabled: boolean;
    channel_points_per_vote: number;
    status: TPollStatus;
    duration: number;
    started_at: string;
};
export type TGetPollsResponse = TList & {
    data: TPoll[];
};
export type TGetPollsParams = Partial<TFirst & {
    id: string;
}>;
export {};
