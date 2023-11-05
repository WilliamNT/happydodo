import { RowDataPacket } from "mysql2";

/**
 * Type of the anime.
 * If  unknown, `UNKNOWN` is the value.
 */
export enum AnimeType {
    TV = 'TV',
    MOVIE = 'MOVIE',
    OVA = 'OVA',
    ONA = 'ONA',
    SPECIAL = 'SPECIAL',
    UNKNOWN = 'UNKNOWN'
};

/**
 * Status of the anime.
 * If unknown, `UNKNOWN` is the value.
 */
export enum AnimeStatus {
    FINISHED = 'FINISHED',
    ONGOING = 'ONGOING',
    UPCOMING = 'UPCOMING',
    UNKNOWN = 'UNKNOWN'
};

/**
 * Season of the anime.
 * If not applicable or unknown, `UNDEFINED` is the value.
 */
export enum AnimeSeason {
    SPRING = 'SPRING',
    SUMMER = 'SUMMER',
    FALL = 'FALL',
    WINTER = 'WINTER',
    UNDEFINED = 'UNDEFINED'
};

/**
 * The anime show/movie/clip itself.
 * 
 * Has many types of metadata related to the anime.
 */
export interface IAnime extends RowDataPacket {
    id: number;
    title: string;
    type?: AnimeType
    episodes?: number;
    status?: AnimeStatus;
    season?: AnimeSeason;
    year?: number;
    poster_filename?: string;
    thumbnail_filename?: string;
    rating?: number;
    description?: string;
    dataAdded: Date;
    dataUpdated: Date;
};