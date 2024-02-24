import { TFirst } from "./common";

export type TTag = {
    tag_id: string
    is_auto: boolean
    localization_names: Record<string, string>
    localization_descriptions: Record<string, string>
}

export type TGetTagsResponse = {
    data: TTag[]
}

export type TGetTagsParams = TFirst & {
    tag_id: string
}