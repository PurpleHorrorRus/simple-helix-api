const fetch = require("node-fetch");
const { encode } = require("querystring");

const syncRequest = async params => {
    const response = await fetch(params.url, params);

    if (response.status === 200) {
        return response.json();
    } else {
        return new Error(response.statusText);
    }
};

class Helix {
    constructor (params) {
        if (!params.client_id) {
            return console.error({ error: "Client ID is required" });
        }

        this.client_id = params.client_id;
        this.headers = { 
            "Client-ID": params.client_id,
            "Accept": "application/vnd.twitchtv.v5+json"
        };

        this.disableWarns = params.disableWarns;
        this.redirect_uri = params.redirect_uri || "";

        if (params.access_token) {
            this.access_token = params.access_token;
            this.auth = {
                OAuth: `OAuth ${params.access_token}`,
                Bearer: `Bearer ${params.access_token}`
            };

            this.headers.Authorization = this.auth.Bearer;
        }
        else {
            if (!params.disableWarns) {
                console.warn("You not set up access token");
            }
        }
    };

    handleError (error) { 
        console.error(error);
        return new Error(error);
    }

    oauth () {
        const headers = { ...this.headers };
        headers["Content-Type"] = "application/json";
        headers.Authorization = this.auth.OAuth;
        return headers;
    }

    getAuthLink (client_id = this.client_id, redirect_uri = this.redirect_uri, scopes = "all") {
        if (client_id.length === 0 || redirect_uri.length === 0) {
            console.error("You must to specify client_id and redirect_uri");
            return;
        }

        if (scopes === "all") {
            scopes = [
                "analytics:read:extensions", "analytics:read:games", "bits:read",
                "channel:edit:commercial", "channel:manage:broadcast", "channel:manage:extensions",
                "channel:manage:redemptions", "channel:read:hype_train", "channel:read:redemptions",
                "channel:read:stream_key", "channel:read:subscriptions", "clips:edit",
                "moderation:read", "user:edit", "user:edit:follows", "user:read:broadcast",
                "user:read:email"
            ];
        } else {
            if (!Array.isArray(scopes)) {
                this.handleError("Scopes list must be an array or 'all' value");
                return;
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

        const query = encode(params);
        return `https://id.twitch.tv/oauth2/authorize?${query}`;
    }

    async requestEndpoint (endpoint, query = "", params = {}) {
        query = typeof query === "object"
            ? encode(query)
            : query;

        const response = await syncRequest({
            url: `https://api.twitch.tv/helix/${endpoint}?${query}`,
            headers: this.headers,
            ...params
        }).catch(this.handleError);

        return response;
    }

    async getUser (user) {
        const query = encode(
            Number(user)
                ? { id: user }
                : { login: user }
        );

        const response = await this.requestEndpoint("users", query).catch(this.handleError);
        return response.data[0];
    }

    async getChannel (user_id) {
        const url = `https://api.twitch.tv/kraken/channels/${user_id}`;
        const response = await syncRequest({ url, headers: this.headers }).catch(this.handleError);
        return response;
    }

    async getStream (user) {
        const query = encode(
            Number(user)
                ? { user_id: user }
                : { user_login: user }
        );

        const response = await this.requestEndpoint("streams", query).catch(this.handleError);
        return response.data[0] || this.handleError("You must start stream to get stream data or wait for Twitch to announce you online");
    }

    async getStreams (params = {}) {
        const query = encode(params);
        
        const response = await this.requestEndpoint("streams", query).catch(this.handleError);
        return response;
    }

    async getStreamMeta (user) {
        const query = encode(
            Number(user)
                ? { user_id: user }
                : { user_login: user }
        );

        const response = await this.requestEndpoint("streams/metadata", query).catch(this.handleError);
        return response.data[0] || this.handleError("You must start stream to get stream data or wait for Twitch to announce you online");
    }

    async getGame (game) {
        const query = encode(
            Number(game)
                ? { game_id: game }
                : { name: game }
        );

        const response = await this.requestEndpoint("games", query).catch(this.handleError);
        return response.data[0];
    }

    async getFollowers (user_id, count = 20, after = "") {
        if (count > 100) {
            return this.handleError("You can't fetch more than 100 followers per request");
        }

        const query = encode({
            to_id: user_id,
            first: count,
            after
        });

        const response = await this.requestEndpoint("users/follows", query);
        return response;
    }

    async getAllFollowers (user_id) {
        const count = await this.getFollowersCount(user_id);
        let list = [];
        let cursor = "";
        
        while (list.length < count) {
            const response = await this.getFollowers(user_id, 100, cursor).catch(this.handleError);
            cursor = response.pagination.cursor;

            list = [
                ...list,
                ...response.data
            ];
        }

        return list;
    }

    async getFollowersCount (user_id) {
        const query = encode({ to_id: user_id });

        const { total } = await this.requestEndpoint("users/follows", query).catch(this.handleError);
        return total;
    }

    async getViewers (user) {
        user = user.toLowerCase();
        const url = `https://tmi.twitch.tv/group/user/${user}/chatters`;
        const response = await syncRequest({ url }).catch(this.handleError);
        return response;
    }

    async getCheermotes (user_id) {
        const query = encode({ broadcaster_id: user_id });

        const { data } = await this.requestEndpoint("bits/cheermotes", query).catch(this.handleError);
        return data;
    }

    async getBitsLeaderboard (params = {}) {
        const query = encode(params);

        const data = await this.requestEndpoint("bits/leaderboard", query).catch(this.handleError);
        return data;
    }

    async getBannedUsers (user_id, params = {}) {
        const query = encode({
            broadcaster_id: user_id,
            ...params
        });

        const data = await this.requestEndpoint("moderation/banned", query).catch(this.handleError);
        return data;
    }

    async getModerators (user_id, params) {
        const query = encode({
            broadcaster_id: user_id,
            ...params
        });

        const data = await this.requestEndpoint("moderation/moderators", query).catch(this.handleError);
        return data;
    }

    async searchCategories (category, params = {}) {
        if (category.length) {
            const query = encode({
                query: category,
                ...params
            });

            const data = await this.requestEndpoint("search/categories", query).catch(this.handleError);
            return data;
        }
    }

    async searchChannels (channel, params = {}) {
        if (channel.length) {
            const query = encode({
                query: channel,
                ...params
            });

            const data = await this.requestEndpoint("search/channels", query).catch(this.handleError);
            return data;
        }
    }

    async getStreamKey (user_id) {
        const query = encode({ broadcaster_id: user_id });
        const { data } = await this.requestEndpoint("streams/key", query).catch(this.handleError);
        return data[0].stream_key;
    }
    
    async updateStream (user_id, title, game) {
        if (!this.access_token) {
            return this.handleError("You must to provide access token to update stream");
        }

        const response = await syncRequest({
            url: `https://api.twitch.tv/kraken/channels/${user_id}`,
            method: "PUT",
            body: JSON.stringify({
                channel: {
                    status: title,
                    game
                }
            }),
            headers: this.oauth()
        }).catch(this.handleError);

        return { 
            success: response.status === title && response.game === game 
        };
    }

    async createClip (user_id, has_delay = false) {
        const query = encode({
            broadcaster_id: user_id,
            has_delay
        });
        
        const { data } = await this.requestEndpoint("clips", query, { method: "POST" }).catch(this.handleError);
        return data[0];
    }

    async getClips (user_id, params = { first: 20 }) {
            if (params.first > 100) {
                return this.handleError("You can't fetch more than 100 clips per request");
            }

            const query = encode({
                broadcaster_id: user_id,
                ...params
            });

            const data = await this.requestEndpoint("clips", query).catch(this.handleError);
            return data;
    }

    async getAllClips (user_id) {
        let cursor = "";

        const get = async () => {
            const { data, pagination } = await this.getClips(user_id, {
                first: 100,
                after: cursor
            }).catch(this.handleError);
            
            cursor = pagination.cursor;
            return data;
        };

        let clips = await get();

        while (cursor) {
            clips = [
                ...clips,
                ...await get().catch(this.handleError)
            ];
        }

        return clips;
    }

    async createMarker (user_id, description = "") {
        if (!this.access_token) {
            return this.handleError("You must to provide access token to create stream marker");
        }

        const response = await this.requestEndpoint("streams/markers", null, {
            method: "PUT",
            body: JSON.stringify({ 
                user_id: user_id, 
                description 
            }),
            headers: this.oauth()
        });

        if (response.error) {
            return { 
                status: "error", 
                error: response.error 
            };
        }

        return { 
            status: "success", 
            ...response 
        };
    }

    async getMarkers (user_id, video_id) {
        if (!this.access_token) {
            return this.handleError("You must to provide access token to get stream markers");
        }

        const response = await this.requestEndpoint("streams/markers", null, {
            method: "GET",
            body: JSON.stringify({ 
                user_id, 
                video_id 
            }),
            headers: this.oauth()
        }).catch(this.handleError);

        return response;
    }

    async getTopGames (count = 100) {
        const { data } = await this.requestEndpoint("games/top", { first: count }).catch(this.handleError);
        return data;
    }

    async startCommercial (user_id, length = 30) {
        if (!this.access_token) {
            return this.handleError("You must to provide access token to start commercial");
        }

        const isValidLength =
            length >= 30  &&
            length <= 180 &&
            length % 30 === 0

        if (!isValidLength) {
            return this.handleError("You must to specify valid length of commercial (30, 60, 90, 120, 150, 180)");
        }

        const response = await this.requestEndpoint("channels/commercial", null, {
            method: "POST",
            body: JSON.stringify({ 
                broadcaster_id: user_id,
                length
            }),
            headers: this.headers
        });

        return response;
    }

    createChatBot (username, password, channel) {
        const tmi = require("tmi.js");
        const client = new tmi.client({
            connection: { reconnect: true },
            identity: { username, password },
            channels: [channel]
        });

        client.connect();
        return client;
    }

}

module.exports = Helix;