import { RawAxiosRequestHeaders } from "axios";

import Static from "../static";
import { TUpdateGuestStarParams } from "./types/guest_star";

class GuestStar extends Static {
	constructor(headers: RawAxiosRequestHeaders) {
		super(headers);
	}

	async update(broadcaster_id: string, params?: TUpdateGuestStarParams) {
		return await this.put("guest_star/channel_settings", {
			broadcaster_id
		}, params);
	}

	async settings(broadcaster_id: string) {
		return await this.getRequest("/guest_star/channel_settings", {
			broadcaster_id,
			moderator_id: broadcaster_id
		});
	}

	async session(broadcaster_id: string, moderator_id?: string) {
		return await this.getRequest("guest_star/session", {
			broadcaster_id,
			moderator_id: moderator_id || broadcaster_id
		});
	}

	async createSession(broadcaster_id: string) {
		return await this.post("guest_star/session", {
			broadcaster_id
		});
	}

	async endSession(broadcaster_id: string, session_id: string) {
		return await this.delete("guest_star/session", {
			broadcaster_id,
			session_id
		});
	}

	async invites(broadcaster_id: string, session_id: string, moderator_id?: string) {
		return await this.getRequest("guest_star/invites", {
			broadcaster_id,
			session_id,
			moderator_id: moderator_id || broadcaster_id,
		});
	}

	async sendInvite(broadcaster_id: string, session_id: string, guest_id: string, moderator_id?: string) {
		return await this.post("guest_star/invites", {
			broadcaster_id,
			session_id,
			guest_id,
			moderator_id: moderator_id || broadcaster_id
		});
	}

	async deleteInvite(broadcaster_id: string, session_id: string, guest_id: string, moderator_id?: string) {
		return await this.delete("guest_star/invites", {
			broadcaster_id,
			session_id,
			guest_id,
			moderator_id: moderator_id || broadcaster_id
		});
	}

	async assignSlot(broadcaster_id: string, session_id: string, guest_id: string, slot_id: string, moderator_id?: string) {
		return await this.post("guest_star/assign_slot", {
			broadcaster_id,
			session_id,
			guest_id,
			slot_id,
			moderator_id: moderator_id || broadcaster_id
		});
	}

	async updateSlot(broadcaster_id: string, session_id: string, source_slot_id: string, destination_slot_id: string, moderator_id?: string) {
		return await this.post("guest_star/update_slot", {
			broadcaster_id,
			session_id,
			source_slot_id,
			destination_slot_id,
			moderator_id: moderator_id || broadcaster_id
		});
	}

	async deleteSlot(broadcaster_id: string, session_id: string, guest_id: string, slot_id: string, should_reinvite_guest?: string, moderator_id?: string) {
		return await this.delete("guest_star/delete_slot", {
			broadcaster_id,
			session_id,
			guest_id,
			slot_id,
			should_reinvite_guest,
			moderator_id: moderator_id || broadcaster_id
		});
	}

	async updateSlotSettings(broadcaster_id: string, session_id: string, slot_id: string, is_audio_enabled?: boolean, is_video_enabled?: boolean, is_live?: boolean, volume?: number, moderator_id?: string) {
		return await this.post("guest_star/update_slot_settings", {
			broadcaster_id,
			session_id,
			slot_id,
			is_audio_enabled,
			is_video_enabled,
			is_live,
			volume,
			moderator_id: moderator_id || broadcaster_id
		});
	}
}

export default GuestStar;