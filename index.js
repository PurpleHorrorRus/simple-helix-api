const Analytics = require("./lib/requests/analytics");
const Automod = require("./lib/requests/automod");
const Channel = require("./lib/requests/channel");
const Chat = require("./lib/requests/chat");
const Clips = require("./lib/requests/clips");
const Commercial = require("./lib/requests/commercial");
const Events = require("./lib/requests/events");
const Games = require("./lib/requests/games");
const Markers = require("./lib/requests/markers");
const Moderation = require("./lib/requests/moderation");
const Other = require("./lib/requests/other");
const Polls = require("./lib/requests/polls");
const Predictions = require("./lib/requests/predictions");
const Rewards = require("./lib/requests/rewards");
const Schedule = require("./lib/requests/schedule");
const Search = require("./lib/requests/search");
const Soundtrack = require("./lib/requests/soundtrack");
const Stream = require("./lib/requests/stream");
const Subscriptions = require("./lib/requests/subscriptions");
const Tags = require("./lib/requests/tags");
const Teams = require("./lib/requests/teams");
const Users = require("./lib/requests/users");
const Videos = require("./lib/requests/videos");

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

    handleError (error) { 
        throw new Error(error);
    }

    getAuthLink (scopes = []) {
        if (scopes.length === 0) {
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
        } else if (!Array.isArray(scopes)) {
            return this.handleError("Scopes list must be an array");
        }

        const params = {
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            response_type: "token",
            scope: scopes.join(" ")
        };

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