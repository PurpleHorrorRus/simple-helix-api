const request = require("request");

const syncRequest = params => {
    return new Promise((resolve, reject) => {
        params.url = encodeURI(params.url);
        request(params, (err, response, body) => {
            if(err) return reject(err);
            try { return resolve(JSON.parse(body)); } catch(e) { return resolve(body); }
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

        if(params.access_token) Helix.prototype.access_token = params.access_token;
        else {
            if(!params.disableWarns) 
                console.warn("You not set up access token");
        }	
    };

    async getUser(user) {
        const url = `https://api.twitch.tv/helix/users?${Number(user) ? "id" : "login"}=${user}`;
        const response = await syncRequest({ url, headers: this.headers });
        return response.data[0];
    }

    async getChannel(user_id) {
        const response = await syncRequest({
            url: `https://api.twitch.tv/kraken/channels/${user_id}`,
            headers: {
                "Client-ID": this.client_id,
                "Accept": "application/vnd.twitchtv.v5+json"
            }
        });
        return response;
    }

    async getStream(user) {
        const url = `https://api.twitch.tv/helix/streams?${Number(user) ? "user_id" : "user_login"}=${user}`;
        const response = await syncRequest({ url, headers: this.headers });
        return response.data[0] ? response.data[0] : { error: "You must start stream to get stream data or wait for Twitch to announce you online" };
    }

    async getStreamMeta(user) {
        const url = `https://api.twitch.tv/helix/streams/metadata?${Number(user) ? "user_id" : "user_login"}=${user}`;
        const response = await syncRequest({ url, headers: this.headers });
        return response.data[0] ? response.data[0] : { error: "You must start stream to get stream data or wait for Twitch to announce you online" };
    }

    async getGame(game) {
        const url = `https://api.twitch.tv/helix/games?${Number(game) ? "game_id" : "name"}=${game}`;
        const response = await syncRequest({ url, headers: this.headers });
        return response.data[0];
    }

    async getFollowers(user_id, count = 20, after = "") {
        const url = `https://api.twitch.tv/helix/users/follows?to_id=${user_id}&first=${count}&after=${after}`;
        const response = await syncRequest({ url, headers: this.header });
        return response;
    }

    async getAllFollowers(user_id) {
        return new Promise(async resolve => {
            const response = await this.getFollowers(user_id, 100);
            const count = response.total;
            let list = response.data;
            let interval = setInterval(async () => {
                if(list.length < count) {
                    const _response = await this.getFollowers(user_id, 100, response.pagination.cursor);
                    list = list.concat(_response.data);
                } else {
                    clearInterval(interval);
                    return resolve(list);
                }
            }, 200);
        });

    }

    async getFollowersCount(user_id) {
        const response = await syncRequest({
            url: `https://api.twitch.tv/helix/users/follows?to_id=${user_id}`,
            headers: this.headers
        });
        return response.total;
    }

    async getViewers(user) {
        user = user.toLowerCase();
        const response = await syncRequest(`https://tmi.twitch.tv/group/user/${user}/chatters`);
        return response;
    }
    
    async updateStream(id, title, game) {
        if(!this.access_token) return console.error({ error: "You must to provide access token to update stream" });
        const response = await syncRequest({
            url: `https://api.twitch.tv/kraken/channels/${id}`,
            method: "PUT",
            json: {
                "channel[status]": title,
                "channel[game]": game
            },
            headers: {
                "Client-ID": this.client_id,
                "Accept": "application/vnd.twitchtv.v5+json",
                "Authorization": `OAuth ${this.access_token}`
            }
        });
        return { success: response.status == title && response.game == game };
    }

    async getTopGames(count = 100) {
        const response = await syncRequest({
            url: `https://api.twitch.tv/helix/games/top?first=${count}`,
            headers: this.headers
        });
        return response.data;
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