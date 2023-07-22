export type TUpdateGuestStarParams = Partial<{
	is_moderator_send_live_enabled: boolean
	slot_cout: number
	is_browser_source_audio_enabled: boolean
	group_layout: "TILED_LAYOUT" | "SCREENSHARE_LAYOUT" | "HORIZONTAL_LAYOUT" | "VERTICAL_LAYOUT"
}>;