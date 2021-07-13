const Static = require("../static");

class Events extends Static {
    constructor(headers) {
        super(headers);
    }

    async hypetrain(broadcaster_id, params = {}) {
        return await this.requestCustom("hypetrain/events", broadcaster_id, params);
    }

    async banned(broadcaster_id, params = {}) {
        return await this.requestCustom("moderation/banned/events", broadcaster_id, params);
    }

    async moderator(broadcaster_id, params = {}) {
        return await this.requestCustom("moderation/moderators/events", broadcaster_id, params);
    }
};

module.exports = Events;