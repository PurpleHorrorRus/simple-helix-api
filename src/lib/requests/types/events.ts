type TEventsHypetrainLastContributionType = "BITS"
    | "SUBS"
    | "OTHER"

type TEventsHypetrainLastContribution = {
    total: number
    type: TEventsHypetrainLastContributionType
    user: string
}

export type TEventsHypetrainParams = Partial<{
    first: number
    after: string
}>

export type TEventsHypetrain = {
    id: string
    event_type: string
    event_timestamp: string
    version: string

    event_data: {
        broadcaster_id: string
        cooldown_end_time: string
        expires_at: string
        goal: number
        id: string

        last_contribution: TEventsHypetrainLastContribution,

        level: number,
        started_at: string
        top_contributions: TEventsHypetrainLastContribution[],
        total: number
    }
}