const Static = require("../static");

class Users extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_FROM_ID: "You must to specify from_id field",
            MISSING_TO_ID: "You must to specify to_id field",
            MISSING_TARGET: "Missing target ID"
        };
    }

    async getByID(id) {
        return await this.requestEndpoint("users", { id });
    }

    async getByLogin(login) {
        return await this.requestEndpoint("users", { login });
    }

    async get(user) {
        return Number(user) ? await this.getByID(user) : await this.getByLogin(user);
    }

    async update(params = {}) {
        return await this.requestEndpoint("users", params, { method: "PUT" });
    }

    async follows(to_id, params = {}) {
        if (!to_id) {
            return this.handleError(this.ERRORS.MISSING_TO_ID);
        }

        return await this.requestEndpoint("users/follows", { to_id, ...params });
    }

    async allFollows(to_id, params = {}) {
        return await this.requestAll(to_id, this, "follows", params.limit);
    }

    async manageFollows(method = "POST", from_id, to_id, params = {}) {
        if (!from_id) {
            return this.handleError(this.ERRORS.MISSING_FROM_ID);
        }

        if (!to_id) {
            return this.handleError(this.ERRORS.MISSING_TO_ID);
        }

        return await this.requestEndpoint("users/follows", { from_id, to_id, ...params }, { method });
    }

    async createFollows(from_id, to_id, params = {}) {
        return await this.manageFollows("POST", from_id, to_id, params);
    }

    async deleteFollows(from_id, to_id, params = {}) {
        return await this.manageFollows("DELETE", from_id, to_id, params);
    }

    async blocklist(broadcaster_id, params = {}) {
        return await this.requestCustom("users/blocks", broadcaster_id, params);
    }

    async manageBlock(method = "PUT", target_user_id, params = {}) {
        if (!target_user_id) {
            return this.handleError(this.ERRORS.MISSING_TARGET);
        }

        return await this.requestEndpoint("users/blocks", { target_user_id, ...params }, { method });
    }

    async block(target_user_id, params = {}) {
        return await this.manageBlock("PUT", target_user_id, params);
    }

    async unblock(target_user_id, params = {}) {
        return await this.manageBlock("DELETE", target_user_id, params);
    }

    async extensions() {
        return await this.requestCustom("users/extensions/list", {});
    }

    async activeExtensions(params = {}) {
        return await this.requestCustom("users/extensions", params);
    }

    async updateExtensions() {
        return await this.requestEndpoint("users/extensions", {}, { method: "PUT" });
    }
};

module.exports = Users;