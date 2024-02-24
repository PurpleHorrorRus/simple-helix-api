import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TFirstBefore } from "./types/common";
import { TGamesResponse } from "./types/games";
declare class Games extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    getById(id: string): Promise<TGamesResponse>;
    getByName(name: string): Promise<TGamesResponse>;
    get(game: string): Promise<TGamesResponse>;
    top(params?: TFirstBefore): Promise<TGamesResponse>;
}
export default Games;
