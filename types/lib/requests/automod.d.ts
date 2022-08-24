import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Automod extends Static {
    constructor(headers: AxiosRequestHeaders);
    settings(broadcaster_id: number, moderator_id: number): Promise<any>;
    updateSettings(broadcaster_id: number, moderator_id: number, settings: any): Promise<any>;
}
export default Automod;
