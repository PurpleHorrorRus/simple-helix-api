export type TViewersResponse = {
    _links: Record<string, any>
    chatter_count: number

    chatters: {
        broadcaster: string[]
        vips: string[],
        moderators: [],
        staff: string[],
        admins: string[],
        global_mods: string[]
        viewers: string[]
    }
}