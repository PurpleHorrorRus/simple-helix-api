import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";
import { TFirstBefore } from "./types/common";

import { TGamesResponse } from "./types/games";

class Games extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async getById(id: string): Promise<TGamesResponse> {
        return await this.getRequest("games", { id });
    }

    async getByName(name: string): Promise<TGamesResponse> {
        return await this.getRequest("games", { name });
    }

    async get(game: string): Promise<TGamesResponse> {
        return Number(game)
            ? await this.getById(game)
            : await this.getByName(game);
    }

    async top(params?: TFirstBefore): Promise<TGamesResponse> {
        return await this.getRequest("games/top", params);
    }
}

export default Games;