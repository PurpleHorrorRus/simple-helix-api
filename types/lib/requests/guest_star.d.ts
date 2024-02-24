import { RawAxiosRequestHeaders } from "axios";
import Static from "../static";
import { TUpdateGuestStarParams } from "./types/guest_star";
declare class GuestStar extends Static {
    constructor(headers: RawAxiosRequestHeaders);
    update(broadcaster_id: string, params?: TUpdateGuestStarParams): Promise<any>;
    settings(broadcaster_id: string): Promise<any>;
    session(broadcaster_id: string, moderator_id?: string): Promise<any>;
    createSession(broadcaster_id: string): Promise<any>;
    endSession(broadcaster_id: string, session_id: string): Promise<any>;
    invites(broadcaster_id: string, session_id: string, moderator_id?: string): Promise<any>;
    sendInvite(broadcaster_id: string, session_id: string, guest_id: string, moderator_id?: string): Promise<any>;
    deleteInvite(broadcaster_id: string, session_id: string, guest_id: string, moderator_id?: string): Promise<any>;
    assignSlot(broadcaster_id: string, session_id: string, guest_id: string, slot_id: string, moderator_id?: string): Promise<any>;
    updateSlot(broadcaster_id: string, session_id: string, source_slot_id: string, destination_slot_id: string, moderator_id?: string): Promise<any>;
    deleteSlot(broadcaster_id: string, session_id: string, guest_id: string, slot_id: string, should_reinvite_guest?: string, moderator_id?: string): Promise<any>;
    updateSlotSettings(broadcaster_id: string, session_id: string, slot_id: string, is_audio_enabled?: boolean, is_video_enabled?: boolean, is_live?: boolean, volume?: number, moderator_id?: string): Promise<any>;
}
export default GuestStar;
