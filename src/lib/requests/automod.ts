import { AxiosRequestHeaders } from "axios";

import Static from "../static";

enum ERRORS {
    INVALID_SETTINGS = "Settings object is invalid",
    MISSING_MODERATOR_ID = "You must to specify moderator_id"
}

class Automod extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
    }

    async settings(broadcaster_id: number, moderator_id: number) {
        if (!moderator_id) {
            return this.handleError(ERRORS.MISSING_MODERATOR_ID);
        }

        return await this.requestCustom("moderation/automod/settings", broadcaster_id, { moderator_id });
    }

    async updateSettings(broadcaster_id: number, moderator_id: number, settings: any) {
        if (!moderator_id) {
            return this.handleError(ERRORS.MISSING_MODERATOR_ID);
        }

        if (!(settings instanceof Object) || Object.keys(settings).length === 0) {
            return this.handleError(ERRORS.INVALID_SETTINGS);
        }

        return await this.requestCustom("moderation/automod/settings", broadcaster_id, { moderator_id }, {
            method: "PUT",
            data: settings,
            ignoreStatus: true
        });
    }
}

export default Automod;