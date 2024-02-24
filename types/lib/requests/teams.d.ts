import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TGetChannelTeamsResponse, TGetTeamsResponse } from "./types/teams";
declare class Teams extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    channel(broadcaster_id: string): Promise<TGetChannelTeamsResponse>;
    get(team?: string | number): Promise<TGetTeamsResponse>;
}
export default Teams;
