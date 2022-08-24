import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Commercial extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_LENGTH: "Invalid commercial length"
        };
    }

    async start(broadcaster_id: number, length = 30) {
        if (length % 30 !== 0) {
            return this.handleError(this.ERRORS.INVALID_LENGTH);
        }

        return this.requestEndpoint("channels/commercial", {
            broadcaster_id,
            length: Math.max(Math.min(length, 180), 30)
        }, { method: "POST" })
    }
};

export default Commercial;