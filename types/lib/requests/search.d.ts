import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TFirst } from "./types/common";
import { TSearchCategoriesResponse, TSearchCategory, TSearchChannel, TSearchChannelsParams, TSearchChannelsResponse } from "./types/search";
declare class Search extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    categories(query: string, params?: TFirst): Promise<TSearchCategoriesResponse>;
    allCategories(query: string, limit?: number): Promise<TSearchCategory[]>;
    channels(query: string, params?: TSearchChannelsParams): Promise<TSearchChannelsResponse>;
    allChannels(query: string, limit?: number): Promise<TSearchChannel[]>;
}
export default Search;
