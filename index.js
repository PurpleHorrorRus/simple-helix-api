const fetch = require("node-fetch");
const { encode } = require("querystring");

const syncRequest = params => {
    return new Promise((resolve, reject) => {
        fetch(params.url, params)
            .then(result => {
                if (result.status === 200) {
                    return result.json();
                } else {
                    return reject({
                        status: result.status,
                        statusText: result.statusText
                    });
                }
            })
            .then(resolve)
            .catch(reject)
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
                Helix.prototype.headers = Object.assign(Helix.prototype.headers, { 
                    Authorization: Helix.prototype.auth.Bearer 
                });
            } else {
                Helix.prototype.headers = Object.assign(Helix.prototype.headers, { 
                    Authorization: Helix.prototype.auth.OAuth 
                });
            }
        }
        else {
            if (!params.disableWarns) {
                console.warn("You not set up access token");
            }

            if (params.increaseRate) {
                console.warn("To increase the rate you need to provide access_token");
            }
        }
    };

    handleError (error) { 
        console.error(error);
        return new Error(error);
    }

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
        }).catch(this.handleError);
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
        return response.data[0] || { error: "You must start stream to get stream data or wait for Twitch to announce you online" };
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

        return await this.requestEndpoint("users/follows", query);
    }

    getAllFollowers (user_id) {
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
        return await syncRequest({
            url: `https://tmi.twitch.tv/group/user/${user}/chatters`
        }).catch(this.handleError);
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
        const query = encode({
            broadcaster_id: user_id
        });

        const { data } = await this.requestEndpoint("streams/key", query).catch(this.handleError);
        return data.stream_key;
    }
    
    async updateStream (user_id, title, game) {
        if (!this.access_token) {
            return this.handleError("You must to provide access token to update stream");
        }

        const response = await syncRequest({
            url: `https://api.twitch.tv/kraken/channels/${user_id}`,
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

    async createClip (user_id, has_delay = false) {
        const query = encode({
            broadcaster_id: user_id,
            has_delay
        });
        
        const { data } = await this.requestEndpoint("clips", query, { method: "POST" }).catch(this.handleError);
        const [clip] = data;

        return clip;
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

    getAllClips (user_id) {
        return new Promise(async resolve => {
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

            return resolve(clips);
        });
    }

    async createMarker (user_id, description = "") {
        if (!this.access_token) {
            return this.handleError("You must to provide access token to create stream marker");
        }

        const response = await syncRequest({
            url: "https://api.twitch.tv/helix/streams/markers",
            method: "PUT",
            json: { 
                user_id: user_id, 
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

    async getMarkers (user_id, video_id) {
        if (!this.access_token) {
            return this.handleError("You must to provide access token to get stream markers");
        }

        return await syncRequest({
            url: "https://api.twitch.tv/helix/streams/markers",
            method: "GET",
            json: { 
                user_id, 
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

        return await syncRequest({
            url: "https://api.twitch.tv/helix/channels/commercial",
            method: "POST",
            json: { 
                broadcaster_id: user_id,
                length
            },
            headers: this.headers
        }).catch(this.handleError);
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