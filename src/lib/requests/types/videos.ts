import { TUser } from "./chat"
import { TFirstBefore, TList } from "./common"

export type TGetVideosParams = TFirstBefore & {
    id?: string
    user_id: string
    game_id?: string
    language?: string
    period?: "all" | "day" | "month" | "week"
    sort?: "time" | "trending" | "views"
    type?: "all" | "archive" | "highlight" | "upload"
}

export type TVideo = TUser & {
    id: string
    stream_id: string | null
    title: string
    description: string
    created_at: string
    published_at: string
    url: string
    thumbnail_url: string
    viewable: "public"
    view_count: number
    language: string
    type: "archive" | "highlight" | "upload"
    duration: string

    muted_segments: Array<{
        duration: string
        offset: string
    }>
}

export type TGetVideosResponse = TList & {
    data: TVideo[]
}

export type TDeleteVideosResponse = {
    data: string[]
}