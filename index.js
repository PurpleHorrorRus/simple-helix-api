const Channel = require("./lib/requests/channel");
const Clips = require("./lib/requests/clips");
const Commercial = require("./lib/requests/commercial");
const Analytics = require("./lib/requests/analytics");
const Rewards = require("./lib/requests/rewards");
const Games = require("./lib/requests/games");
const Events = require("./lib/requests/events");
const Moderation = require("./lib/requests/moderation");
const Polls = require("./lib/requests/polls");
const Predictions = require("./lib/requests/predictions");
const Schedule = require("./lib/requests/schedule");
const Search = require("./lib/requests/search");
const Stream = require("./lib/requests/stream");
const Markers = require("./lib/requests/markers");
const Subscriptions = require("./lib/requests/subscriptions");
const Tags = require("./lib/requests/tags");
const Teams = require("./lib/requests/teams");
const Users = require("./lib/requests/users");
const Videos = require("./lib/requests/videos");
const Other = require("./lib/requests/other");
const Chat = require("./lib/requests/chat");

class Helix {
    constructor (params) {
        if (!params.client_id) {
            return this.handleError("Client ID is required");
        }

        this.client_id = params.client_id;
        this.redirect_uri = params.redirect_uri || "";
        this.language = params.language || "en";
        
        if (params.access_token) {
            this.headers = { 
                "Authorization": `Bearer ${params.access_token}`,
                "Client-Id": params.client_id,
                "Accept": "application/vnd.twitchtv.v5+json",
                "Content-Type": "application/json",
            };

            this.channel = new Channel(this.headers);
            this.clips = new Clips(this.headers);
            this.rewards = new Rewards(this.headers);
            this.commercial = new Commercial(this.headers);
            this.analytics = new Analytics(this.headers);
            this.chat = new Chat(this.headers);
            this.games = new Games(this.headers);
            this.events = new Events(this.headers);
            this.moderation = new Moderation(this.headers);
            this.polls = new Polls(this.headers);
            this.predictions = new Predictions(this.headers);
            this.schedule = new Schedule(this.headers);
            this.search = new Search(this.headers);
            this.stream = new Stream(this.headers);
            this.markers = new Markers(this.headers);
            this.subscriptions = new Subscriptions(this.headers);
            this.tags = new Tags(this.headers);
            this.teams = new Teams(this.headers);
            this.users = new Users(this.headers);
            this.videos = new Videos(this.headers);
            this.other = new Other(this.headers);
        }
    };

    handleError (error) { 
        throw new Error(error);
    }

    getAuthLink (client_id = this.client_id, redirect_uri = this.redirect_uri, scopes = "all") {
        if (client_id.length === 0 || redirect_uri.length === 0) {
            return this.handleError("You must to specify client_id and redirect_uri");
        }

        if (scopes === "all") {
            scopes = [
                "analytics:read:extensions", "analytics:read:games", 
                "bits:read", 

                "channel:edit:commercial", "channel:manage:broadcast", "channel:manage:extensions",
                "channel:manage:polls", "channel:manage:predictions", "channel:manage:redemptions",
                "channel:manage:schedule", "channel:manage:videos", "channel:read:editors",
                "channel:read:hype_train", "channel:read:polls", "channel:read:predictions",
                "channel:read:redemptions", "channel:read:stream_key", "channel:read:subscriptions", "channel:moderate", 

                "moderation:read", "moderator:manage:automod", "moderator:manage:chat_settings",
                "moderator:manage:banned_users", "moderator:read:blocked_terms", "moderator:manage:blocked_terms",
                "moderator:read:automod_settings", "moderator:manage:automod_settings", "moderator:read:chat_settings",

                "whispers:read", "whispers:edit",
                "chat:read", "chat:edit", "clips:edit", 
                "user:edit", "user:edit:follows", "user:manage:blocked_users", "user:read:blocked_users", "user:read:broadcast", "user:read:email", "user:read:follows", "user:read:subscriptions", 
                "channel_editor", "openid"
            ];
        } else {
            if (!Array.isArray(scopes)) {
                return this.handleError("Scopes list must be an array or 'all' value");
            }
        }

        const params = {
            client_id,
            redirect_uri,
            response_type: "token"
        };

        if (scopes.length > 0) {
            params.scope = scopes.join(" ");
        }

        return `https://id.twitch.tv/oauth2/authorize?${new URLSearchParams(params).toString()}`;
    }

    async updateStream(broadcaster_id, title, game) {
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

module.exports = Helix;