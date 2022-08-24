import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Channel extends Static {
    constructor(headers: AxiosRequestHeaders);
    get(broadcaster_id: (string | number)[]): Promise<any>;
    modify(broadcaster_id: number, game_id: string | undefined, broadcaster_language: string | undefined, title: string, delay?: number): Promise<any>;
    editors(broadcaster_id: number): Promise<any>;
}
export default Channel;
