import { AxiosRequestHeaders } from "axios";

import Static from "../static";

class Games extends Static {
    constructor(headers: AxiosRequestHeaders) {
        super(headers);
    }

    async getByID(id: number) {
        return await this.requestEndpoint("games", { id });
    }

    async getByName(name: string) {
        return await this.requestEndpoint("games", { name });
    }

    async get(game: number | string) {
        return typeof game === "number"
            ? await this.getByID(game)
            : await this.getByName(game);
    }

    async top() {
        return await this.requestEndpoint("games/top");
    }
}

export default Games;