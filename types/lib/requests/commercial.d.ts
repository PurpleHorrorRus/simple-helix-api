import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Commercial extends Static {
    constructor(headers: AxiosRequestHeaders);
    start(broadcaster_id: number, length?: number): Promise<any>;
}
export default Commercial;
