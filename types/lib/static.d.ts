import { AxiosRequestHeaders, AxiosRequestConfig } from "axios";
export declare type TRequestConfig = AxiosRequestConfig & {
    ignoreStatus?: boolean;
};
declare class Static {
    headers: AxiosRequestHeaders;
    ERRORS: {
        [x: string]: string;
    };
    constructor(headers: AxiosRequestHeaders);
    request(url: string, data?: any, requestOptions?: TRequestConfig): Promise<any>;
    requestEndpoint(endpoint: string, data?: any, requestOptions?: AxiosRequestConfig): Promise<any>;
    requestAll(broadcaster_id: any | any[], context: any, builder: string, limit?: number, first?: number): Promise<any>;
    requestCustom(endpoint: string, broadcaster_id: number, params?: {}, requestOptions?: TRequestConfig): Promise<any>;
    handleError(error: string): void;
}
export default Static;
