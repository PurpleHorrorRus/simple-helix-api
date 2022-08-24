import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Users extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            MISSING_FROM_ID: "You must to specify from_id field",
            MISSING_TO_ID: "You must to specify to_id field",
            MISSING_TARGET: "Missing target ID"
        };
    }

    async getByID(id: number) {
        return await this.requestEndpoint("users", { id });
    }

    async getByLogin(login: string) {
        return await this.requestEndpoint("users", { login });
    }

    async get(user: number | string) {
        return typeof user === "number"
            ? await this.getByID(user)
            : await this.getByLogin(user);
    }

    async update(params = {}) {
        return await this.requestEndpoint("users", params, {
            method: "PUT"
        });
    }

    async follows(to_id: number, params = {}) {
        if (!to_id) {
            return this.handleError(this.ERRORS.MISSING_TO_ID);
        }

        return await this.requestEndpoint("users/follows", {
            to_id,
            ...params
        });
    }

    async allFollows(to_id: number, limit = Infinity) {
        return await this.requestAll(to_id, this, "follows", limit);
    }

    async blocklist(broadcaster_id: number, params = {}) {
        return await this.requestCustom("users/blocks", broadcaster_id, params);
    }

    async manageBlock(method = "PUT", target_user_id: number, params = {}) {
        if (!target_user_id) {
            return this.handleError(this.ERRORS.MISSING_TARGET);
        }

        return await this.requestEndpoint("users/blocks", { target_user_id, ...params }, { method });
    }

    async block(target_user_id: number, params = {}) {
        return await this.manageBlock("PUT", target_user_id, params);
    }

    async unblock(target_user_id: number, params = {}) {
        return await this.manageBlock("DELETE", target_user_id, params);
    }

    async extensions(broadcaster_id: number) {
        return await this.requestCustom("users/extensions/list", broadcaster_id);
    }

    async activeExtensions(broadcaster_id: number, params = {}) {
        return await this.requestCustom("users/extensions", broadcaster_id, params);
    }

    async updateExtensions() {
        return await this.requestEndpoint("users/extensions", {}, { method: "PUT" });
    }
};

export default Users;