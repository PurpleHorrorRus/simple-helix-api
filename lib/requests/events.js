const Static = require("../static");

class Events extends Static {
    constructor(headers) {
        super(headers);
    }

    async hypetrain(broadcaster_id, params = {}) {
        return await this.requestGet("hypetrain/events", broadcaster_id, params);
    }

    async banned(broadcaster_id, params = {}) {
        return await this.requestGet("moderation/banned/events", broadcaster_id, params);
    }

    async moderator(broadcaster_id, params = {}) {
        return await this.requestGet("moderation/moderators/events", broadcaster_id, params);
    }
};

module.exports = Events;