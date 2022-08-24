import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Soundtrack extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);

        this.ERRORS = {
            ...this.ERRORS,
            PLAYLIST_ID_NOT_SPECIFIED: "You must to specify playlist id"
        };
    }

    async track(broadcaster_id: number) {
        return await this.requestCustom("soundtrack/current_track", broadcaster_id);
    }

    async playlist(id: number) {
        if (!id) {
            return this.handleError(this.ERRORS.PLAYLIST_ID_NOT_SPECIFIED);
        }
        
        return await this.requestEndpoint("soundtrack/playlist", { id });
    }

    async playlists() {
        return await this.requestEndpoint("soundtrack/playlists");
    }
}

export default Soundtrack;