import { TUser } from "./chat"
import { TFirstBefore, TList } from "./common"

export type TMarker = {
    id: string
    created_at: string
    description: string,
    position_seconds: number
}

type TMarkerWithUrl = TMarker & {
    URL: string
}

type TMarkerVideo = {
    video_id: string
    markers: TMarkerWithUrl[]
}

export type TGetMarkersParams = TFirstBefore;

export type TGetMarkersResponse = TList & {
    data: TUser & {
        videos: TMarkerVideo[]
    }
}

export type TCreateMarkerParams = {
    description?: string
}
