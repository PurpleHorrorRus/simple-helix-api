import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Teams extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_FIELDS: "You must to specify team name or ID"
        };
    }

    async channel(broadcaster_id: number) {
        return await this.requestCustom("teams/channel", broadcaster_id);
    }

    async get(id: number, name: string) {
        if (!id && !name) {
            return this.handleError(this.ERRORS.MISSING_FIELDS);
        }

        const params: any = {};
        id ? params.id = id : params.name = name;
        return await this.requestEndpoint("teams", params);
    }
};

export default Teams;