import {
    TFirst,
    TList,
    TPagination
} from "./common";

export type TSearchCategory = {
    id: string
    name: string
    box_art_url: string
}

export type TSearchCategoriesResponse = TList & {
    data: TSearchCategory[]
}

export type TSearchChannelsParams = Partial<TFirst & {
    live_only: boolean
}>

export type TSearchChannel = {
    broadcaster_language: string
    broadcaster_login: string
    display_name: string
    game_id: string
    game_name: string
    id: string
    is_live: boolean
    tags: string[]
    thumbnail_url: string
    title: string
    started_at: string
}

export type TSearchChannelsResponse = {
    data: TSearchChannel[],
    pagination: TPagination
}