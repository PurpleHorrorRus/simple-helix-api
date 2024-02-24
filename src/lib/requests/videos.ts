import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";

import { TDeleteVideosResponse, TGetVideosParams, TGetVideosResponse, TVideo } from "./types/videos";

class Videos extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async get(params: TGetVideosParams): Promise<TGetVideosResponse> {
		return await this.getRequest("videos", params);
	}

	async all(fields: TGetVideosParams, limit = Infinity): Promise<TVideo[]> {
		return await this.requestAll(fields, this, "get", limit);
	}

	async deleteVideos(videos: string[] | number[]): Promise<TDeleteVideosResponse> {
		return await this.delete("videos", {
			video_ids: videos.map(a => (`id=${a}`)).join("&")
		});
	}
}

export default Videos;