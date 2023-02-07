import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import { TViewersResponse } from "./types/other";

class Other extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async getViewers(user: string): Promise<TViewersResponse> {
        user = user.toLowerCase();
        return await this.request(`https://tmi.twitch.tv/group/user/${user}/chatters`);
    }
}

export default Other;