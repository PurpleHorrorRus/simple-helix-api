export type TCommercial = {
    length: number
    message: string
    retry_after: number
}

export type TAdSchedule = {
    snooze_count: number
    snooze_refresh_at: number
    next_ad_at: number
    duration: number
    last_ad_at: number
    preroll_free_time: number
}

export type TAdScheduleResponse = {
    data: TAdSchedule[]
}

export type TSnoozeNextAd = {
    snooze_count: number
    snooze_refresh_at: number
    next_ad_at: number
}

export type TSnoozeNextAdResponse = {
    data: TSnoozeNextAd[]
}