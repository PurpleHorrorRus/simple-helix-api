import { TPagination } from "./common";

export type TGame = {
    id: string
    name: string
    box_art_url: string
    igdb_id: string
}

export type TGamesResponse = {
    data: TGame[]
    pagination: TPagination
}