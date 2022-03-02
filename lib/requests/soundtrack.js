const Static = require("../static");

class Soundtrack extends Static {
    constructor(headers) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            PLAYLIST_ID_NOT_SPECIFIED: "You must to specify playlist id"
        };
    }

    async track(broadcaster_id) {
        return await this.requestCustom("soundtrack/current_track", broadcaster_id);
    }

    async playlist(id) {
        if (!id) {
            return this.handleError(this.ERRORS.PLAYLIST_ID_NOT_SPECIFIED);
        }
        
        return await this.requestEndpoint("soundtrack/playlist", { id });
    }

    async playlists() {
        return await this.requestEndpoint("soundtrack/playlists");
    }
};

module.exports = Soundtrack;