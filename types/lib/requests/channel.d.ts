import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Channel extends Static {
    constructor(headers: AxiosRequestHeaders);
    get(broadcaster_id: (string | number)[]): Promise<any>;
    modify(broadcaster_id: number, game_id: string | undefined, broadcaster_language: string | undefined, title: string, delay?: number): Promise<any>;
    editors(broadcaster_id: number): Promise<any>;
    addVip(broadcaster_id: number, user_id: number): Promise<any>;
    removeVip(broadcaster_id: number, user_id: number): Promise<any>;
    vips(broadcaster_id: number, params?: {}): Promise<any>;
    allVips(broadcaster_id: number, limit?: number): Promise<any>;
    whisper(from_user_id: number, to_user_id: number, message: string): Promise<any>;
}
export default Channel;
