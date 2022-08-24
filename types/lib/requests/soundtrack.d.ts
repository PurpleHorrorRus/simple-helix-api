import { AxiosRequestHeaders } from "axios";
import Static from "../static";
declare class Soundtrack extends Static {
    constructor(headers: AxiosRequestHeaders);
    track(broadcaster_id: number): Promise<any>;
    playlist(id: number): Promise<any>;
    playlists(): Promise<any>;
}
export default Soundtrack;
