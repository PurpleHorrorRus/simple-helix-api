import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Users extends Static {
    constructor(headers: AxiosRequestHeaders);
    getByID(id: number): Promise<any>;
    getByLogin(login: string): Promise<any>;
    get(user: number | string): Promise<any>;
    update(params?: {}): Promise<any>;
    follows(to_id: number, params?: {}): Promise<any>;
    allFollows(to_id: number, limit?: number): Promise<any>;
    blocklist(broadcaster_id: number, params?: {}): Promise<any>;
    manageBlock(method: string | undefined, target_user_id: number, params?: {}): Promise<any>;
    block(target_user_id: number, params?: {}): Promise<any>;
    unblock(target_user_id: number, params?: {}): Promise<any>;
    extensions(broadcaster_id: number): Promise<any>;
    activeExtensions(broadcaster_id: number, params?: {}): Promise<any>;
    updateExtensions(): Promise<any>;
}
export default Users;
