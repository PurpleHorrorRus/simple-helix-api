const Static = require("../static");

class Commercial extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            INVALID_LENGTH: "Invalid commercial length"
        };
    }

    async start(broadcaster_id, length = 30) {
        length = Math.max(Math.min(length, 180), 30);

        if (length % 30 !== 0) {
            return this.handleError(this.ERRORS.INVALID_LENGTH);
        }

        return this.requestEndpoint("channels/commercial", {}, {
            method: "POST",
            body: {
                broadcaster_id,
                length
            }
        })
    }
};

module.exports = Commercial;