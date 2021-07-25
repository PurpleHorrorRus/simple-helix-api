const Static = require("../static");
const Channel = require("./channel");

class Badges extends Static {
    constructor(headers) {
        super(headers);
        this.channel = Channel.prototype.badges;
    }

    async global() {
        return await this.requestEndpoint("chat/badges/global");
    }
};

module.exports = Badges;