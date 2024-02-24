import { TList } from "./common";

export type TGetUser = {
    id: string
    login: string
    display_name: string
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

type TBlockedUser = {
    user_id: string
    user_login: string
    display_name: string
}

export type TGetBlockedResponse = TList & {
    data: TBlockedUser[]
}