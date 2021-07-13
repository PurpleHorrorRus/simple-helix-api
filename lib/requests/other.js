const Static = require("../static");

class Other extends Static {
    constructor(headers) {
        super(headers);
    }

    async getViewers (user) {
        return await this.request(`https://tmi.twitch.tv/group/user/${user.toLowerCase()}/chatters`);
    }
};

module.exports = Other;