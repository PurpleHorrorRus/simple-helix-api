import { TUser } from "./chat";
import { TBroadcaster } from "./common";
export type TTeamBasic = {
    background_image_url: string | null;
    banner: string | null;
    created_at: string;
    updated_at: string;
    info: string;
    thumbnail_url: string;
    team_name: string;
    team_display_name: string;
    id: string;
};
export type TGetChannelTeamsResponse = {
    data: (TBroadcaster & TTeamBasic)[];
};
type TTeam = TTeamBasic & {
    users: TUser[];
};
export type TGetTeamsResponse = {
    data: TTeam[];
};
export {};
