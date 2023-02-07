import { TUser } from "./chat"
import { TFirstBefore, TList, TModerator } from "./common"

export type TShieldMode = {
    is_active: boolean
    last_activated_at: string
}

export type TBanUserResponse = {
    broadcaster_id: string
    moderator_id: string
    user_id: string
    created_at: string
    end_time: string | null
}

export type TBanUserParams = {
    user_id: string
    duration?: number
    reason?: string
}

export type TBannedUser = TUser & TModerator & {
    expires_at: string
    created_at: string
    reason: string
}

export type TGetBannedUsersResponse = TList & {
    data: TBannedUser[]
}

export type TGetBannedUsersParams = Partial<TFirstBefore & {
    user_id: string
}>

export type TGetModeratorsResponse = TList & {
    data: TUser[]
}

export type TBlockedTerm = {
    broadcaster_id: string
    moderator_id: string
    id: string
    created_at: string
    updated_at: string
    expires_at: string | null
}

export type TBlockedTermsResponse = TList & {
    data: TBlockedTerm[]
}