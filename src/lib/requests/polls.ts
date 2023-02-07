import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import {
    TEndPollStatus,
    TGetPollsParams,
    TGetPollsResponse,
    TPoll,
    TPollChoice
} from "./types/polls";

// Do not change this values. 
const pollConfig = {
    MAX_TITLE_LENGTH: 60,

    MIN_CHOICES: 2,
    MAX_CHOICES: 5,

    MAX_CHOICE_ITEM_TITLE_LENGTH: 25,

    MIN_TIMEOUT: 15,
    MAX_TIMEOUT: 1800
};

class Polls extends Static {
    constructor(headers: RawAxiosRequestHeaders) {
        super(headers);
    }

    async create(broadcaster_id: string, title: string, choices: TPollChoice[], duration = pollConfig.MIN_TIMEOUT): Promise<TPoll> {
        return await this.post("polls", {}, {
            broadcaster_id,
    
            title: title.substring(0, pollConfig.MAX_TITLE_LENGTH),
            
            choices: choices.map(o => ({
                title: o.title.substring(0, pollConfig.MAX_CHOICE_ITEM_TITLE_LENGTH)
            })),
            
            duration: Math.max(
                Math.min(duration, pollConfig.MAX_TIMEOUT),
                pollConfig.MIN_TIMEOUT
            )
        });
    }

    async end(broadcaster_id: string, id: string, status: TEndPollStatus = "ARCHIVED"): Promise<TPoll> {
        return await this.patch("polls", {
            broadcaster_id,
            id,
            status
        });
    }

    async get(broadcaster_id: string, params?: TGetPollsParams): Promise<TGetPollsResponse> {
        return await this.getRequest("polls", {
            broadcaster_id,
            ...params
        });
    }

    async all(broadcaster_id: string, limit = Infinity): Promise<TPoll[]> {
        return await this.requestAll(broadcaster_id, this, "get", limit);
    }
}

export default Polls;