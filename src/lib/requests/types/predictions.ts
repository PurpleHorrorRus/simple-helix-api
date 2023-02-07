import { TFirst, TList } from "./common";

type TPredictionColor = "BLUE"
    | "PINK";

export type TPredictionStatus = "ACTIVE"
    | "RESOLVED"
    | "CANCELED"
    | "LOCKED";

export type TPredictionOutcomeNative = {
    id: string
    title: string
    users: number
    channel_points: number
    top_predictors: string[] | null
    color: TPredictionColor
}

export type TPredictionOutcome = {
    title: string
}

export type TGetPredictionsParams = Partial<TFirst & {
    id: string
}>

export type TPrediction = {
    id: string
    broadcaster_id: string
    broadcaster_name: string
    broadcaster_login: string
    title: string
    winning_outcome_id: string
    outcomes: TPredictionOutcomeNative[]
    prediction_window: number
    status: TPredictionStatus
    created_at: string
    ended_at: string
    locked_at: string
}

export type TGetPredictionsResponse = TList & {
    data: TPrediction[]
}