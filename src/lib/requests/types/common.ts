export type TBroadcaster = {
    broadcaster_id: string
    broadcaster_name: string
    broadcaster_login: string
}

export type TModerator = {
    moderator_id: string
    moderator_name: string
    moderator_login: string
}

export type TPagination = {
    cursor: string
}

export type TList = {
    pagination: Partial<TPagination>
}

export type TDate = Partial<{
    started_at: string
    ended_at: string
}>

export type TFirst = Partial<{
    first: number
    after: string
}>

export type TFirstBefore = Partial<TFirst & {
    before: string
}>