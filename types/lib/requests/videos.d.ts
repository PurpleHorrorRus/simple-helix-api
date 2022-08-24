import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare type TGetVideoFields = Partial<{
    id: number;
    user_id: number;
    game_id: number;
}>;
declare class Videos extends Static {
    constructor(headers: AxiosRequestHeaders);
    get(fields: TGetVideoFields, params?: {}): Promise<any>;
    all(fields: TGetVideoFields, limit?: number): Promise<any>;
    delete(videos: string[] | number[]): Promise<any>;
}
export default Videos;
