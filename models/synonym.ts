/**
 * An alternative title for the anime with id `animeId`.
 */
export type AnimeSynonym = {
    id: number;
    animeId: number;
    synonym: string;
    dataAdded: Date;
    dataUpdated: Date;
};