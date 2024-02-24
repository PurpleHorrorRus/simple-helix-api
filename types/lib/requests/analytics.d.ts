import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TBitsAnaylticsResponse, TCheermotes, TExtensionAnalyticsResponse, TGameAnalytics, TGetBitsAnalyticsParams, TGetCheermotesParams, TGetExtensionAnalyticsParams, TGetExtensionTransactionsParams, TGetGameAnalyticsParams } from "./types/analytics";
declare class Analytics extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    extension(data: TGetExtensionAnalyticsParams): Promise<TExtensionAnalyticsResponse>;
    game(data: TGetGameAnalyticsParams): Promise<TGameAnalytics[]>;
    bits(data?: TGetBitsAnalyticsParams): Promise<TBitsAnaylticsResponse>;
    cheermotes(data?: TGetCheermotesParams): Promise<TCheermotes[]>;
    extensionTransactions(extension_id: number, data: TGetExtensionTransactionsParams): Promise<TExtensionAnalyticsResponse>;
}
export default Analytics;
