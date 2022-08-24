import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Other extends Static {
    constructor(headers: AxiosRequestHeaders);
    getViewers(user: string): Promise<any>;
}
export default Other;
