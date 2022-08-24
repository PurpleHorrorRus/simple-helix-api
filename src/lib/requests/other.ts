import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Other extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
    }

    async getViewers(user: string) {
        user = user.toLowerCase();
        return await this.request(`https://tmi.twitch.tv/group/user/${user}/chatters`);
    }
};

export default Other;