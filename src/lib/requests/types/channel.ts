import { TUser } from "./chat"
import { TBroadcaster, TFirst, TList } from "./common"

export type TChannel = {
    broadcaster_id: string
    broadcaster_login: string
    broadcaster_name: string
    broadcaster_language: string
    game_id: string
    game_name: string
    title: string
    delay: number
    tags: string[]
}

export type TEditor = {
    user_id: string
    user_name: string
    created_at: string
}

export type TGetVipsRequestParams = Partial<TFirst & {
    user_id: string | number
}>

export type TGetVipsResponse = TList & {
    data: TUser[]
}

export type TGetFollowedParams = Partial<TFirst & {
    broadcaster_id: string
}>

export type TGetFollowedUser = TBroadcaster & {
    followed_at: string
}

export type TGetFollowedResponse = TList & {
    data: TGetFollowedUser[]
    total: number
}

export type TGetFollowersParams = Partial<TFirst & {
    user_id: string
}>