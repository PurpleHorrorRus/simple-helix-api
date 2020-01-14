const request = require("request");

const syncRequest = params => {
    return new Promise((resolve, reject) => {
        params.url = encodeURI(params.url);
        request(params, (err, response) => {
            const { body } = response;
            if(err) throw reject(err);
            try {
                const json = JSON.parse(body);
                if(json.status === 429) return reject({ error: "Too Many Requests" });
                else return resolve(json);
            } catch(e) { return resolve(body); }
        });
    });
};

class Helix {

    constructor(params) {
        if(!params.client_id) return console.error({ error: "Client ID is required" });

        Helix.prototype.client_id = params.client_id;
        Helix.prototype.headers = { 
            "Client-ID": params.client_id,
            "Accept": "application/vnd.twitchtv.v5+json"
        };
        Helix.prototype.disableWarns = params.disableWarns;

        if(params.access_token) {
            Helix.prototype.access_token = params.access_token;
            Helix.prototype.auth = {
                OAuth: `OAuth ${params.access_token}`,
                Bearer: `Bearer ${params.access_token}`
            };
            if(params.increaseRate) {
                Helix.prototype.increaseRate = true;
                Helix.prototype.headers = Object.assign(Helix.prototype.headers, { "Authorization": Helix.prototype.auth.Bearer });
            } else Helix.prototype.headers = Object.assign(Helix.prototype.headers, { "Authorization": Helix.prototype.auth.OAuth });
        }
        else {
            if(!params.disableWarns) 
                console.warn("You not set up access token");
            if(params.increaseRate)
                console.warn("To increase the rate you need to provide access_token");
        }
            
    };

    handleError(error) { throw error; }
    oauth() {
        let headers = this.headers;
        headers["Authorization"] = this.auth.OAuth;
        return headers;
    }

    async getUser(user) {
        const url = `https://api.twitch.tv/helix/users?${Number(user) ? "id" : "login"}=${user}`;
        const response = await syncRequest({ url, headers: this.headers }).catch(this.handleError);
        return response.data[0];
    }

    async getChannel(user_id) {
        const url = `https://api.twitch.tv/kraken/channels/${user_id}`;
        return await syncRequest({ url, headers: this.headers }).catch(this.handleError);;
    }

    async getStream(user) {
        const url = `https://api.twitch.tv/helix/streams?${Number(user) ? "user_id" : "user_login"}=${user}`;
        const response = await syncRequest({ url, headers: this.headers }).catch(this.handleError);
        return response.data[0] ? response.data[0] : { error: "You must start stream to get stream data or wait for Twitch to announce you online" };
    }

    async getStreamMeta(user) {
        const url = `https://api.twitch.tv/helix/streams/metadata?${Number(user) ? "user_id" : "user_login"}=${user}`;
        const response = await syncRequest({ url, headers: this.headers }).catch(this.handleError);
        return response.data[0] ? response.data[0] : { error: "You must start stream to get stream data or wait for Twitch to announce you online" };
    }

    async getGame(game) {
        const url = `https://api.twitch.tv/helix/games?${Number(game) ? "game_id" : "name"}=${game}`;
        const response = await syncRequest({ url, headers: this.headers }).catch(this.handleError);
        return response.data[0];
    }

    async getFollowers(user_id, count = 20, after = "") {
        if(count > 100) return console.error("You can't fetch more than 100 followers per request");
        const url = `https://api.twitch.tv/helix/users/follows?to_id=${user_id}&first=${count}&after=${after}`;
        return await syncRequest({ url, headers: this.headers });
    }

    async getAllFollowers(user_id) {
        return new Promise(async resolve => {
            const count = await this.getFollowersCount(user_id);
            let list = [];
            let cursor = "";

            const get = async () => {
                const _response = await this.getFollowers(user_id, 100, cursor);
                cursor = _response.pagination.cursor;
                list = list.concat(_response.data);
                if(list.length < count) return get();
                else return resolve(list);
            };

            return get();
        });

    }

    async getFollowersCount(user_id) {
        const url = `https://api.twitch.tv/helix/users/follows?to_id=${user_id}`;
        const { total } = await syncRequest({ url, headers: this.headers }).catch(this.handleError);
        return total;
    }

    async getViewers(user) {
        user = user.toLowerCase();
        return await syncRequest(`https://tmi.twitch.tv/group/user/${user}/chatters`).catch(this.handleError);
    }
    
    async updateStream(id, title, game) {
        if(!this.access_token) return console.error({ error: "You must to provide access token to update stream" });
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
        return { success: response.status == title && response.game == game };
    }

    async createMarker(id, description = "") {
        if(!this.access_token) return console.error({ error: "You must to provide access token to create stream marker" });
        const response = await syncRequest({
            url: "https://api.twitch.tv/helix/streams/markers",
            method: "PUT",
            json: { user_id: id, description },
            headers: this.oauth()
        }).catch(this.handleError);
        if(response.error) return { status: "error", error: response.error };
        return Object.assign({ status: "success" }, response);
    }

    async getMarkers(id, video_id) {
        if(!this.access_token) return console.error({ error: "You must to provide access token to get stream markers" });
        return await syncRequest({
            url: "https://api.twitch.tv/helix/streams/markers",
            method: "GET",
            json: { user_id: id, video_id },
            headers: this.oauth()
        }).catch(this.handleError);
    }

    async getTopGames(count = 100) {
        const url = `https://api.twitch.tv/helix/games/top?first=${count}`;
        const { data } = await syncRequest({ url, headers: this.headers }).catch(this.handleError);
        return data;
    }

    createChatBot(username, password, channel) {
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