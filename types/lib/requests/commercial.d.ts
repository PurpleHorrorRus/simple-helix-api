import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TCommercial } from "./types/commercial";
declare class Commercial extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    start(broadcaster_id: string, length?: number): Promise<TCommercial>;
}
export default Commercial;
