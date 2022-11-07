import { AxiosRequestHeaders } from "axios";

import Analytics from "./lib/requests/analytics";
import Automod from "./lib/requests/automod";
import Channel from "./lib/requests/channel";
import Chat from "./lib/requests/chat";
import Clips from "./lib/requests/clips";
import Commercial from "./lib/requests/commercial";
import Events from "./lib/requests/events";
import Games from "./lib/requests/games";
import Markers from "./lib/requests/markers";
import Moderation from "./lib/requests/moderation";
import Other from "./lib/requests/other";
import Polls from "./lib/requests/polls";
import Predictions from "./lib/requests/predictions";
import Rewards from "./lib/requests/rewards";
import Schedule from "./lib/requests/schedule";
import Search from "./lib/requests/search";
import Soundtrack from "./lib/requests/soundtrack";
import Stream from "./lib/requests/stream";
import Subscriptions from "./lib/requests/subscriptions";
import Tags from "./lib/requests/tags";
import Teams from "./lib/requests/teams";
import Users from "./lib/requests/users";
import Videos from "./lib/requests/videos";

import EventSub from "./lib/eventsub/websocket";

import Static from "./lib/static";

type HelixInitParams = {
    client_id: string
    access_token?: string
    language?: string
};

class Helix extends Static {
    private client_id: string;
    private language?: string;

    headers: AxiosRequestHeaders;

    analytics: Analytics;
    automod: Automod;
    channel: Channel;
    chat: Chat;
    clips: Clips;
    commercial: Commercial;
    events: Events;
    games: Games;
    markers: Markers;
    moderation: Moderation;
    other: Other;
    polls: Polls;
    predictions: Predictions;
    rewards: Rewards;
    schedule: Schedule;
    search: Search;
    soundtrack: Soundtrack;
    stream: Stream;
    subscriptions: Subscriptions;
    tags: Tags;
    teams: Teams;
    users: Users;
    videos: Videos;

    EventSub: EventSub;

    constructor(params: HelixInitParams) {
        super({
            "Authorization": `Bearer ${params.access_token}`,
            "Client-Id": params.client_id,
            "Accept": "application/vnd.twitchtv.v5+json",
            "Content-Type": "application/json"
        });

        this.client_id = params.client_id;
        this.language = params.language || "";
        
        if (params.access_token) {
            this.analytics = new Analytics(this.headers);
            this.automod = new Automod(this.headers);
            this.channel = new Channel(this.headers);
            this.chat = new Chat(this.headers);
            this.clips = new Clips(this.headers);
            this.commercial = new Commercial(this.headers);
            this.events = new Events(this.headers);
            this.games = new Games(this.headers);
            this.markers = new Markers(this.headers);
            this.moderation = new Moderation(this.headers);
            this.other = new Other(this.headers);
            this.polls = new Polls(this.headers);
            this.predictions = new Predictions(this.headers);
            this.rewards = new Rewards(this.headers);
            this.schedule = new Schedule(this.headers);
            this.search = new Search(this.headers);
            this.soundtrack = new Soundtrack(this.headers);
            this.stream = new Stream(this.headers);
            this.subscriptions = new Subscriptions(this.headers);
            this.tags = new Tags(this.headers);
            this.teams = new Teams(this.headers);
            this.users = new Users(this.headers);
            this.videos = new Videos(this.headers);

            this.EventSub = new EventSub(this.headers);
        }
    }

    async getAuthLink (scopes: string[] = [], redirect_uri: string) {
        if (scopes.length === 0) {
            scopes = await import("./lib/scopes.json");
        } else if (!Array.isArray(scopes)) {
            return this.handleError("Scopes list must be an array");
        }

        const params = new URLSearchParams();
        params.set("client_id", this.client_id);
        params.set("redirect_uri", redirect_uri);
        params.set("response_type", "token");
        params.set("scope", scopes.join(" "));

        const query = params.toString();
        return `https://id.twitch.tv/oauth2/authorize?${query}`;
    }

    async updateStream(broadcaster_id: number, title: string, game: string) {
        if (!this.headers) {
            return this.handleError("Provide access_token");
        }

        if (!broadcaster_id || !title || !game) {
            return this.handleError("You must to specify all fields");
        }

        const { id } = await this.games.get(game);
        return await this.channel.modify(broadcaster_id, id, this.language, title);
    }
}

export default Helix;