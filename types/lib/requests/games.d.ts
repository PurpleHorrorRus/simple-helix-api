import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Games extends Static {
    constructor(headers: AxiosRequestHeaders);
    getByID(id: number): Promise<any>;
    getByName(name: string): Promise<any>;
    get(game: number | string): Promise<any>;
    top(): Promise<any>;
}
export default Games;
