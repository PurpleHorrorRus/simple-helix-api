import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TChannel, TEditor, TFollow, TGetFollowedParams, TGetFollowedResponse, TGetFollowedUser, TGetFollowersParams, TGetFollowersResponse, TGetVipsRequestParams, TGetVipsResponse } from "./types/channel";
import { TUser } from "./types/chat";
declare class Channel extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    get(broadcaster_id: string | string[]): Promise<TChannel | TChannel[]>;
    modify(broadcaster_id: string, game_id: string | undefined, broadcaster_language: string | undefined, title: string, delay?: number): Promise<TChannel>;
    followers(broadcaster_id: string, params?: TGetFollowersParams): Promise<TGetFollowersResponse>;
    allFollowers(to_id: string, limit?: number): Promise<TFollow[]>;
    editors(broadcaster_id: string): Promise<TEditor[]>;
    addVip(broadcaster_id: string, user_id: string): Promise<any>;
    removeVip(broadcaster_id: string, user_id: string): Promise<any>;
    vips(broadcaster_id: string, params?: TGetVipsRequestParams): Promise<TGetVipsResponse>;
    allVips(broadcaster_id: string, limit?: number): Promise<TUser[]>;
    followed(user_id: string, params?: TGetFollowedParams): Promise<TGetFollowedResponse>;
    allFollowed(user_id: string, limit?: number): Promise<TGetFollowedUser[]>;
    whisper(from_user_id: number, to_user_id: number, message: string): Promise<any>;
}
export default Channel;
