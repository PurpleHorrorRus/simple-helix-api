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

    async chatters(broadcaster_id: number, moderator_id: number, params = {}) { 
        return await this.requestEndpoint("chat/chatters", {
            broadcaster_id,
            moderator_id,
            ...params
        });
    }

    async allChatters(broadcaster_id: number, moderator_id: number) { 
        return await this.requestAll([broadcaster_id, moderator_id], this, "chatters", Infinity, 1000);
    }
}

export default Other;