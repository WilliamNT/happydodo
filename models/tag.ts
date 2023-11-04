/**
 * A tag related to one or more animes.
 */
export type AnimeTag = {
    id: number;
    tag: string;
    dataAdded: Date;
    dataUpdated: Date;
};

/**
 * A relationship between a tag and anime.
 */
export type TagBinding = {
    id: number;
    animeId: number;
    tagId: number;
    dataAdded: Date;
    dataUpdated: Date;
};

