const Static = require("../static");

class Teams extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_FIELDS: "You must to specify team name or ID"
        };
    }

    async channel(broadcaster_id) {
        return await this.requestGet("teams/channel", broadcaster_id);
    }

    async get(id, name) {
        if (!id && !name) {
            return this.handleError(this.ERRORS.MISSING_FIELDS);
        }

        const params = {};
        id ? params.id = id : params.name = name;
        return await this.requestEndpoint("teams", params);
    }
};

module.exports = Teams;