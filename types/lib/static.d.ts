import { RawAxiosRequestHeaders, AxiosRequestConfig } from "axios";
export type TRequestConfig = AxiosRequestConfig & {
    ignoreStatus?: boolean;
};
declare class Static {
    private root;
    headers: RawAxiosRequestHeaders;
    constructor(headers: RawAxiosRequestHeaders);
    request(endpoint: string, data?: any, requestOptions?: TRequestConfig): Promise<any>;
    requestEndpoint(endpoint: string, query?: Record<string, any>, method?: string, data?: Record<string, any>): Promise<any>;
    getRequest(endpoint: string, query?: Record<string, any>): Promise<any>;
    post(endpoint: string, query?: Record<string, any>, data?: Record<string, any>): Promise<any>;
    put(endpoint: string, query?: Record<string, any>, data?: Record<string, any>): Promise<any>;
    patch(endpoint: string, query?: Record<string, any>, data?: Record<string, any>): Promise<any>;
    delete(endpoint: string, query?: Record<string, any>, data?: Record<string, any>): Promise<any>;
    requestAll(broadcaster_id: any | any[], context: any, builder: string, limit?: number, first?: number): Promise<any[]>;
    handleError(error: string): Error;
}
export default Static;
