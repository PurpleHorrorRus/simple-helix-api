import { TFirst, TList } from "./common";
type TCommonAnalyticsParams = Partial<{
    type: string;
    started_at: string;
    ended_at: string;
    first: number;
    after: string;
}>;
type TDateRange = {
    started_at: string;
    ended_at: string;
};
export type TGetGameAnalyticsParams = TCommonAnalyticsParams & {
    game_id: string;
};
export type TGameAnalytics = {
    game_id: string;
    URL: string;
    type: string;
    date_range: TDateRange;
};
export type TGetExtensionAnalyticsParams = TCommonAnalyticsParams & {
    extension_id: string;
};
type TExtensionAnalytics = {
    game_id: string;
    URL: string;
    type: string;
    date_range: TDateRange;
};
export type TExtensionAnalyticsResponse = TList & {
    data: TExtensionAnalytics[];
};
type TUserAnalytics = {
    user_id: string;
    user_login: string;
    user_name: string;
    rank: number;
    score: number;
};
export type TGetBitsAnalyticsParams = Partial<{
    count: number;
    period: string;
    started_at: string;
    user_id: string;
}>;
export type TBitsAnaylticsResponse = {
    data: TUserAnalytics[];
    date_range: TDateRange;
    total: number;
};
export type TGetCheermotesParams = {
    broadcaster_id?: string;
};
type TCheermoteTierImage = {
    animated?: {
        "1": string;
        "1.5": string;
        "2": string;
        "3": string;
        "4": string;
    };
    static?: {
        "1": string;
        "1.5": string;
        "2": string;
        "3": string;
        "4": string;
    };
};
export type TCheermoteTier = {
    min_bits: number;
    id: string;
    color: string;
    can_cheer: boolean;
    show_in_bits_card: boolean;
    images: {
        dark: TCheermoteTierImage;
        light: TCheermoteTierImage;
    };
};
export type TCheermotes = {
    prefix: string;
    tiers: TCheermoteTier[];
};
export type TCheermotesResponse = {
    data: TCheermotes[];
};
export type TGetExtensionTransactionsParams = Partial<TFirst & {
    id: string;
}>;
export type TExtensionTransaction = {
    id: string;
    timestamp: string;
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    user_id: string;
    user_login: string;
    user_name: string;
    product_type: string;
    product_data: {
        domain: string;
        sku: string;
        cost: {
            amount: number;
            type: string;
        };
        inDevelopment: boolean;
        displayName: string;
        expiration: string;
        broadcast: boolean;
    };
};
export type TExtensionTransactionsResponse = TList & {
    data: TExtensionTransaction[];
};
export {};
