import { RowDataPacket } from "mysql2";

/**
 * Maps `animeId` to the different anime providers.
 */
export interface IProviderMapping extends RowDataPacket {
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
export interface IRelationMapping extends RowDataPacket {
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