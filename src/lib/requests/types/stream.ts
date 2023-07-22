import { TUser } from "./chat"

import {
    TFirstBefore,
    TList
} from "./common"

export type TStream = TUser & {
    id: string
    game_id: string
    game_name: string
    type: "" | "live"
    title: string
    tags: string[]
    viewer_count: number
    started_at: string
    language: string
    thumbnail_url: string
    tag_ids: string[]
    content_classification_labels?: []
}

export type TGetStreamsParams = TFirstBefore & Partial<{
    user_id: string
    user_login: string
    game_id: string
    type: "all" | "live"
    language: string
}>

export type TGetStreamsResponse = TList & {
    data: TStream[]
}