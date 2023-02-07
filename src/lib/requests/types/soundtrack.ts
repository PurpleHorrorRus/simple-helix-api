import { TList } from "./common"

type TArtist = {
    id: string
    name: string
    creator_channel_id: string
}

type TAlbum = {
    id: string
    name: string
    image_url: string
}

type TCurrrentTrack = {
    artists: TArtist[]
    id: string
    isrc: string
    duration: number
    title: string
    album: TAlbum
}

type TCurrentTrackSource = {
    id: string
    content_type: "PLAYLIST" | "STATION"
    title: string
    image_url: string
    soundtrack_url?: string
    spotify_url?: string
}

export type TCurrentTrackResponse = {
    data: Array<{
        track: TCurrrentTrack
        source: TCurrentTrackSource
    }>
}

export type TPlaylistResponse = TList & {
    data: TCurrrentTrack[]
}

export type TPlaylistsResponse = TList & {
    data: Array<TAlbum & {
        description: string
    }>
}