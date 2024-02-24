import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";
import { TFirst } from "./types/common";

import { TGetBlockedResponse, TGetUserResponse, TUpdateUserParams } from "./types/users";

class Users extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async getById(id: string): Promise<TGetUserResponse> {
		return await this.getRequest("users", { id });
	}

	async getByLogin(login: string): Promise<TGetUserResponse> {
		return await this.getRequest("users", { login });
	}

	async get(user: string): Promise<TGetUserResponse> {
		return Number(user)
			? await this.getById(user)
			: await this.getByLogin(user);
	}

	async update(params?: TUpdateUserParams) {
		return await this.put("users", params);
	}

	async blocklist(broadcaster_id: string, params?: TFirst): Promise<TGetBlockedResponse> {
		return await this.getRequest("users/blocks", {
			broadcaster_id,
			...params
		});
	}

	async manageBlock(method = "PUT", target_user_id: number, params = {}) {
		return await this.requestEndpoint("users/blocks", {
			target_user_id,
			...params
		}, method);
	}

	async block(target_user_id: number, params = {}) {
		return await this.manageBlock("PUT", target_user_id, params);
	}

	async unblock(target_user_id: number, params = {}) {
		return await this.manageBlock("DELETE", target_user_id, params);
	}

	async extensions(broadcaster_id: string) {
		return await this.getRequest("users/extensions/list", { broadcaster_id });
	}

	async activeExtensions(broadcaster_id: string, params = {}) {
		return await this.getRequest("users/extensions", {
			broadcaster_id,
			...params
		});
	}

	async updateExtensions(data: Record<string, any>) {
		return await this.put("users/extensions", {}, { data });
	}
}

export default Users;