import { TUser } from "./chat";
import { TBroadcaster, TFirstBefore, TList } from "./common";

export type TSubscriber = TBroadcaster & TUser & {
    gifter_id?: string
    gifter_login?: string
    gifter_name?: string
    is_gift: boolean
    tier: string
    plan_name: string
}

export type TGetSubscriptionsParams = TFirstBefore & Partial<{
    user_id: string
}>

export type TGetSubscriptionsResponse = TList & {
    data: TSubscriber[]
    total: number
    points: number
}

export type TCheckUserResponse = TBroadcaster & {
    is_gift: boolean
    tier: string
}