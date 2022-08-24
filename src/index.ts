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

import Static from "./lib/static";

// const Schedule = require("./lib/requests/schedule");
// const Search = require("./lib/requests/search");
// const Soundtrack = require("./lib/requests/soundtrack");
// const Stream = require("./lib/requests/stream");
// const Subscriptions = require("./lib/requests/subscriptions");
// const Tags = require("./lib/requests/tags");
// const Teams = require("./lib/requests/teams");
// const Users = require("./lib/requests/users");
// const Videos = require("./lib/requests/videos");

type HelixInitParams = {
    client_id: string,
    access_token?: string
    redirect_uri?: string,
    language?: string;
};

class Helix extends Static {
    private client_id: string;
    private redirect_uri?: string;
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

    constructor(params: HelixInitParams) {
        super({});

        this.client_id = params.client_id;
        this.redirect_uri = params.redirect_uri || "";
        this.language = params.language || "";
        
        if (params.access_token) {
            this.headers = {
                "Authorization": `Bearer ${params.access_token}`,
                "Client-Id": params.client_id,
                "Accept": "application/vnd.twitchtv.v5+json",
                "Content-Type": "application/json",
            };

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
        }
    };

    getAuthLink (scopes = []) {
        if (scopes.length === 0) {
            scopes = require("./lib/scopes.json");
        } else if (!Array.isArray(scopes)) {
            return this.handleError("Scopes list must be an array");
        }

        //@ts-ignore
        const query = new URLSearchParams({
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            response_type: "token",
            scope: scopes.join(" ")
        }).toString();

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