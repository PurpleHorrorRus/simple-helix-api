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

            this.OAuthHeaders = {
                ...this.headers,
                "Content-Type": "application/json",
                Authorization: this.auth.OAuth
            };
        }
        else {
            if (!params.disableWarns) {
                console.warn("You not set up access token");
            }
        }
    };

    handleError (error) { 
        throw new Error(error);
    }

    /**
    * Generates an authorization link
    * @param {String} client_id 
    * @param {String} redirect_uri 
    * @param {Array} scopes 
    */
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
                "user:read:email", "channel_editor", "chat_login", "openid"
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

        return await syncRequest({
            url: `https://api.twitch.tv/helix/${endpoint}?${query}`,
            headers: this.headers,
            ...params
        }).catch(this.handleError);
    }

    /**
    * Get information about user (example usage: id, profile image, offline image, view count, broadcaster type)
    * @param {Number | String} user 
    */
    async getUser (user) {
        const { data } = await this.requestEndpoint("users", Number(user) ? { id: user } : { login: user }).catch(this.handleError);
        return data[0];
    }

    /**
     * Get channel info like title, game and others
     * @param {Number} user_id 
     */
    async getChannel (user_id) {
        return await syncRequest({ 
            url: `https://api.twitch.tv/kraken/channels/${user_id}`, 
            headers: this.headers 
        }).catch(this.handleError);
    }

    /**
     * Get broadcast information (example usage: realtime viewers count)
     * @param {Number | String} user 
     */
    async getStream (user) {
        const response = await this.requestEndpoint("streams", 
            Number(user)
                ? { user_id: user }
                : { user_login: user }
        ).catch(this.handleError);

        return response.data[0] || this.handleError("You must start stream to get stream data or wait for Twitch to announce you online");
    }

    /**
     * Get information about active streams. Streams are returned sorted by number of current viewers, in descending order. Across multiple pages of results, there may be duplicate or missing streams, as viewers join and leave streams.
     * @param {Object} params 
     */
    async getStreams (params = {}) {
        return await this.requestEndpoint("streams", params).catch(this.handleError);
    }

    /**
     * Get broadcast meta information
     * @param {Number | String} user 
     */
    async getStreamMeta (user) {
        const response = await this.requestEndpoint("streams/metadata",
            Number(user)
                ? { user_id: user }
                : { user_login: user }
        ).catch(this.handleError);

        return response.data[0] || this.handleError("You must start stream to get stream data or wait for Twitch to announce you online");
    }

    /**
     * Get game by this ID or name
     * @param {Number | String} game 
     */
    async getGame (game) {
        const response = await this.requestEndpoint("games", 
            Number(game)
                ? { game_id: game }
                : { name: game }
        ).catch(this.handleError);

        return response.data[0];
    }

    async getFollowers (user_id, count = 20, after = "") {
        if (count > 100) {
            return this.handleError("You can't fetch more than 100 followers per request");
        }

        return await this.requestEndpoint("users/follows", {
            to_id: user_id,
            first: count,
            after
        });
    }

    /**
     * Return an array of all followers. The lead time depends on the number of followers on your channel
     * @param {Number} user_id 
     */
    async getAllFollowers (user_id) {
        let list = [];
        let cursor = "";
        
        while (cursor !== undefined) {
            const response = await this.getFollowers(user_id, 100, cursor).catch(this.handleError);
            cursor = response.pagination?.cursor;

            list = [
                ...list,
                ...response.data
            ];
        }

        return list;
    }

    /**
     * Get number of followers count
     * @param {Number} user_id 
     */
    async getFollowersCount (user_id) {
        const { total } = await this.requestEndpoint("users/follows", { to_id: user_id }).catch(this.handleError);
        return total;
    }

    /**
     * Get viewers splitted by categories (broadcaster, admins, staff, moderators, vips, viewers). Attention! This method used username instead of user ID
     * @param {String} user 
     */
    async getViewers (user) {
        return await syncRequest({ 
            url: `https://tmi.twitch.tv/group/user/${user.toLowerCase()}/chatters`
        }).catch(this.handleError)
    }

    /**
     * Get cheermotes by user id
     * @param {Number} user 
     */
    async getCheermotes (user_id) {
        const { data } = await this.requestEndpoint("bits/cheermotes", { broadcaster_id: user_id }).catch(this.handleError);
        return data;
    }

    /**
     * Get cheers leaderboard
     * @param {Object} params 
     */
    async getBitsLeaderboard (params = {}) {
        return await this.requestEndpoint("bits/leaderboard", params).catch(this.handleError);
    }

    /**
     * Get list of banned users
     * @param {Number} user_id 
     * @param {Object | null} params
     */
    async getBannedUsers (user_id, params = {}) {
        return await this.requestEndpoint("moderation/banned", {
            broadcaster_id: user_id,
            ...params
        }).catch(this.handleError);
    }

    /**
     * Get list of moderators of user
     * @param {Number} user_id
     * @param {Object | null} params
     */
    async getModerators (user_id, params) {
        return await this.requestEndpoint("moderation/moderators", {
            broadcaster_id: user_id,
            ...params
        }).catch(this.handleError);
    }

    /**
     * Search category by the part of the name
     * @param {String} category 
     * @param {Object | null} params
     */
    async searchCategories (category, params = {}) {
        if (category.length > 0) {
            return await this.requestEndpoint("search/categories", {
                query: category,
                ...params
            }).catch(this.handleError);
        }
    }

    /**
     * Search users by the part of the channel name
     * @param {String} channel 
     * @param {Object | null} params
     */
    async searchChannels (channel, params = {}) {
        if (channel.length > 0) {
            return await this.requestEndpoint("search/channels", {
                query: channel,
                ...params
            }).catch(this.handleError);
        }
    }

    /**
     * Get own stream key
     * @param {Number} user_id 
     */
    async getStreamKey (user_id) {
        const { data } = await this.requestEndpoint("streams/key", { broadcaster_id: user_id }).catch(this.handleError);
        return data[0].stream_key;
    }
    
    /**
     * Update stream title and category
     * @param {Number} user_id
     * @param {String} title
     * @param {String} game 
     */
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
            headers: this.OAuthHeaders
        }).catch(this.handleError);

        return { 
            success: response.status === title && response.game === game 
        };
    }

    /**
     * Create clip
     * @param {Number} user_id
     * @param {Boolean} has_delay
     */
    async createClip (user_id, has_delay = false) {
        const { data } = await this.requestEndpoint("clips", {
            broadcaster_id: user_id,
            has_delay
        }, { method: "POST" }).catch(this.handleError);
        return data[0];
    }

    /**
     * Get clips
     * @param {Number} user_id
     * @param {Object | null} params
     */
    async getClips (user_id, params = { first: 20 }) {
        if (params.first > 100) {
            return this.handleError("You can't fetch more than 100 clips per request");
        }

        return await this.requestEndpoint("clips", {
            broadcaster_id: user_id,
            ...params
        }).catch(this.handleError);
    }

    /**
     * Get all clips of channel
     * @param {Number} user_id
     */
    async getAllClips (user_id) {
        let cursor = "";

        const get = async () => {
            const response = await this.getClips(user_id, {
                first: 100,
                after: cursor
            }).catch(this.handleError);
            
            cursor = response.pagination?.cursor;
            return response.data;
        };

        let clips = await get();
        while (cursor !== undefined) {
            clips = [
                ...clips,
                ...await get().catch(this.handleError)
            ];
        }

        return clips;
    }

    /**
     * Create stream marker
     * @param {Number} user_id
     * @param {String | null} description
     */
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
            headers: this.OAuthHeaders
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

    /**
     * Get VOD markers
     * @param {Number} user_id 
     * @param {Number} video_id
     */
    async getMarkers (user_id, video_id) {
        if (!this.access_token) {
            return this.handleError("You must to provide access token to get stream markers");
        }

        return await this.requestEndpoint("streams/markers", null, {
            method: "GET",
            body: JSON.stringify({ 
                user_id, 
                video_id 
            }),
            headers: this.OAuthHeaders
        }).catch(this.handleError);
    }

    /**
     * Get actual top of games on Twitch
     * @param {Number} count 
     */
    async getTopGames (count = 100) {
        const { data } = await this.requestEndpoint("games/top", { first: count }).catch(this.handleError);
        return data;
    }

    /**
     * Starts commercial. Available length values: 30, 60, 90, 120, 150, 180 (in seconds)
     * @param {Number} user_id 
     * @param {Number} length 
     */
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

        return await this.requestEndpoint("channels/commercial", null, {
            method: "POST",
            body: JSON.stringify({ 
                broadcaster_id: user_id,
                length
            }),
            headers: this.headers
        });
    }

    /**
     * Create chatbot. See tmi.js docs for details
     * @param {String} username 
     * @param {String} password 
     * @param {String} channel 
     */
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