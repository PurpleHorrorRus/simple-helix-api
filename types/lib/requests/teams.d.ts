import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Teams extends Static {
    constructor(headers: AxiosRequestHeaders);
    channel(broadcaster_id: number): Promise<any>;
    get(id: number, name: string): Promise<any>;
}
export default Teams;
