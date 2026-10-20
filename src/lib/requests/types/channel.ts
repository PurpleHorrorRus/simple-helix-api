import { TUser } from "./chat";
import { TBroadcaster, TFirst, TList, TPagination } from "./common";

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

export type TFollow = {
	user_id: string
	user_login: string
	user_name: string
	followed_at: string
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

export type TGetFollowersResponse = {
	data: TFollow[]
	pagination: TPagination
}

export type TContentClassificationLabel = {
    id: string
    description: string
    name: string
}

export type TContentClassificationLabelsResponse = {
    data: TContentClassificationLabel[]
}

export type TModifyChannelData = {
    game_id?: string
    broadcaster_language?: string
    title?: string
    delay?: number
    tags?: string[]
    content_classification_labels?: { id: string; is_enabled: boolean }[]
    is_branded_content?: boolean
}