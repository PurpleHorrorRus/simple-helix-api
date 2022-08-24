import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Analytics extends Static {
    constructor(headers: AxiosRequestHeaders);
    extension(data?: {}): Promise<any>;
    game(data?: {}): Promise<any>;
    bits(data?: {}): Promise<any>;
    cheermotes(data?: {}): Promise<any>;
    extensionTransactions(extension_id: number, data?: {}): Promise<any>;
}
export default Analytics;
