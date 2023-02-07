import { TFirst, TList } from "./common"

type TGetUser = {
    id: string
    login: string
    display_nmae: string
    type: "admin" | "global_mod" | "staff" | ""
    broadcaster_type: "affiliate" | "partner" | ""
    description: string
    profile_image_url: string
    offline_image_url: string
    email?: string
    created_at: string
}

export type TGetUserResponse = {
    data: TGetUser[]
}

export type TUpdateUserParams = {
    description?: string
}

export type TFollow = {
    from_id: string
    from_login: string
    from_name: string
    to_id: string
    to_name: string
    followed_at: string
}

export type TGetUserFollowsParams = TFirst & {
    to_id?: string
}

export type TGetUserFollowsResponse = TList & {
    data: TFollow[]
    total: number
}

type TBlockedUser = {
    user_id: string
    user_login: string
    display_name: string
}

export type TGetBlockedResponse = TList & {
    data: TBlockedUser[]
}