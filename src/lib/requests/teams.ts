import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
    TGetChannelTeamsResponse,
    TGetTeamsResponse
} from "./types/teams";

class Teams extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async channel(broadcaster_id: string): Promise<TGetChannelTeamsResponse> {
        return await this.getRequest("teams/channel", { broadcaster_id });
    }

    async get(team?: string | number): Promise<TGetTeamsResponse> {
        return await this.getRequest("teams", {
            [Number(team) ? "id" : "name"]: team
        });
    }
}

export default Teams;