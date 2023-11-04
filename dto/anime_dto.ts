import { AnimeSeason, AnimeStatus, AnimeType } from "../models/anime";

export type AnimeDto = {
    id: number;
    title: string;
    type?: AnimeType;
    episodes?: number;
    status?: AnimeStatus;
    season?: AnimeSeason;
    year?: number;
    rating?: number;
    description?: string;
    tags: string[];
    synonyms: string[];
    poster?: string;
    thumbnail?: string;
};