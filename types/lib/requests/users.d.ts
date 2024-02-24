import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TFirst } from "./types/common";
import { TGetBlockedResponse, TGetUserResponse, TUpdateUserParams } from "./types/users";
declare class Users extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    getById(id: string): Promise<TGetUserResponse>;
    getByLogin(login: string): Promise<TGetUserResponse>;
    get(user: string): Promise<TGetUserResponse>;
    update(params?: TUpdateUserParams): Promise<any>;
    blocklist(broadcaster_id: string, params?: TFirst): Promise<TGetBlockedResponse>;
    manageBlock(method: string | undefined, target_user_id: number, params?: {}): Promise<any>;
    block(target_user_id: number, params?: {}): Promise<any>;
    unblock(target_user_id: number, params?: {}): Promise<any>;
    extensions(broadcaster_id: string): Promise<any>;
    activeExtensions(broadcaster_id: string, params?: {}): Promise<any>;
    updateExtensions(data: Record<string, any>): Promise<any>;
}
export default Users;
