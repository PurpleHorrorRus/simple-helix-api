import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Search extends Static {
    constructor(headers: AxiosRequestHeaders);
    categories(query: string, params?: {}): Promise<any>;
    allCategories(query: string, limit?: number): Promise<any>;
    channels(query: string, params?: {}): Promise<any>;
    allChannels(query: string, limit?: number): Promise<any>;
}
export default Search;
