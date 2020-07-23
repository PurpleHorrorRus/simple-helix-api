const fetch = require("node-fetch");
const { encode } = require("querystring");

const syncRequest = params => {
    return new Promise((resolve, reject) => {
        const url = 
            typeof params === "string"
            ? params
            : params.url;

        delete params.url;
        
        params = params || {};

        fetch(url, params)
            .then(result => result.json())
            .then(json => {
                if (json.status === 429) {
                    return reject(new Error("Too Many Requests"));
                }

                return resolve(json);
            })
            .catch(reject);
    });
};

class Helix {
    constructor(params) {
        if (!params.client_id) {
            return console.error({ error: "Client ID is required" });
        }

        Helix.prototype.client_id = params.client_id;
        Helix.prototype.headers = { 
            "Client-ID": params.client_id,
            "Accept": "application/vnd.twitchtv.v5+json"
        };
        Helix.prototype.disableWarns = params.disableWarns;

        if (params.access_token) {
            Helix.prototype.access_token = params.access_token;
            Helix.prototype.auth = {
                OAuth: `OAuth ${params.access_token}`,
                Bearer: `Bearer ${params.access_token}`
            };
            if (params.increaseRate) {
                Helix.prototype.increaseRate = true;
                Helix.prototype.headers = Object.assign(Helix.prototype.headers, { "Authorization": Helix.prototype.auth.Bearer });
            } else Helix.prototype.headers = Object.assign(Helix.prototype.headers, { "Authorization": Helix.prototype.auth.OAuth });
        }
        else {
            if (!params.disableWarns) 
                console.warn("You not set up access token");
            if (params.increaseRate)
                console.warn("To increase the rate you need to provide access_token");
        }
        
        Helix.prototype.endpoints = {
            users: "https://api.twitch.tv/helix/users",
            streams: "https://api.twitch.tv/helix/streams",
            games: "https://api.twitch.tv/helix/games",
            metadata: "https://api.twitch.tv/helix/streams/metadata"
        };
    };

    handleError (error) { throw error; }
    oauth () {
        const headers = { ...this.headers };
        headers.Authorization = this.auth.OAuth;
        return headers;
    }

    async requestEndpoint (endpoint, query, params) {
        query = typeof query === "object"
            ? encode(query)
            : query;

        return await syncRequest({
            url: `https://api.twitch.tv/helix/${endpoint}?${query}`,
            headers: this.headers,
            ...params
        })
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
        return await syncRequest({ url, headers: this.headers }).catch(this.handleError);;
    }

    async getStream (user) {
        const query = encode(
            Number(user)
                ? { user_id: user }
                : { user_login: user }
        );

        const response = await this.requestEndpoint("streams", query).catch(this.handleError);
        return response.data[0] || { error: "You must start stream to get stream data or wait for Twitch to announce you online" };
    }

    async getStreamMeta (user) {
        const query = encode(
            Number(user)
                ? { user_id: user }
                : { user_login: user }
        );

        const response = await this.requestEndpoint("streams/metadata", query).catch(this.handleError);
        return response.data[0] || { error: "You must start stream to get stream data or wait for Twitch to announce you online" };
    }

    async getGame (game) {
        const query = encode(
            Number(game)
                ? { game_id: game }
                : { name: game }
        );

        const response = await this.requestEndpoint("games", query).catch(this.handleError);
        console.log(response);
        return response.data[0];
    }

    async getFollowers (user_id, count = 20, after = "") {
        if (count > 100) {
            return console.error("You can't fetch more than 100 followers per request");
        }

        const query = encode({
            to_id: user_id,
            first: count,
            after
        });

        return await this.requestEndpoint("follows", query);
    }

    async getAllFollowers (user_id) {
        return new Promise(async (resolve, reject) => {
            const count = await this.getFollowersCount(user_id);
            let list = [];
            let cursor = "";

            const get = async () => {
                const response = await this.getFollowers(user_id, 100, cursor).catch(reject);
                cursor = response.pagination.cursor;
                list = [
                    ...list,
                    ...response.data
                ];
                if (list.length < count) { 
                    return get();
                }
                else { 
                    return resolve(list);
                }
            };

            return get();
        });

    }

    async getFollowersCount (user_id) {
        const query = encode({ to_id: user_id });
        const { total } = await this.requestEndpoint("users/follows", query).catch(this.handleError);
        return total;
    }

    async getViewers (user) {
        user = user.toLowerCase();
        return await syncRequest(`https://tmi.twitch.tv/group/user/${user}/chatters`).catch(this.handleError);
    }
    
    async updateStream (id, title, game) {
        if (!this.access_token) {
            return console.error({ error: "You must to provide access token to update stream" });
        }

        const response = await syncRequest({
            url: `https://api.twitch.tv/kraken/channels/${id}`,
            method: "PUT",
            json: {
                channel: {
                    status: title,
                    game
                }
            },
            headers: this.oauth()
        }).catch(this.handleError);

        return { 
            success: response.status == title && response.game == game 
        };
    }

    async createMarker (id, description = "") {
        if (!this.access_token) {
            return console.error({ error: "You must to provide access token to create stream marker" });
        }
        
        const response = await syncRequest({
            url: "https://api.twitch.tv/helix/streams/markers",
            method: "PUT",
            json: { 
                user_id: id, 
                description 
            },
            headers: this.oauth()
        }).catch(this.handleError);
        
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

    async getMarkers (id, video_id) {
        if (!this.access_token) return console.error({ error: "You must to provide access token to get stream markers" });
        return await syncRequest({
            url: "https://api.twitch.tv/helix/streams/markers",
            method: "GET",
            json: { 
                user_id: id, 
                video_id 
            },
            headers: this.oauth()
        }).catch(this.handleError);
    }

    async getTopGames (count = 100) {
        const url = `https://api.twitch.tv/helix/games/top?first=${count}`;
        const { data } = await syncRequest({ url, headers: this.headers }).catch(this.handleError);
        return data;
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