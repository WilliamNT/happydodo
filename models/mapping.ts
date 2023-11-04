/**
 * Maps `animeId` to the different anime providers.
 */
export type ProviderMapping = {
    id: number;
    anime_id: number;
    anidb?: string;
    anilist?: string;
    animeplanet?: string;
    anisearch?: string;
    kitsu?: string;
    livechart?: string;
    myanimelist?: string;
    notifymoe?: string;
    dataAdded: Date;
    dataUpdated: Date;
};

/**
 * Stores the provider ids of the related animes of anime with `animeId`.
 */
export type RelationMapping = {
    id: number;
    anime_id: number;
    anidb?: string;
    anilist?: string;
    animeplanet?: string;
    anisearch?: string;
    kitsu?: string;
    livechart?: string;
    myanimelist?: string;
    notifymoe?: string;
    dataAdded: Date;
    dataUpdated: Date;
};