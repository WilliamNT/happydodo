import { RowDataPacket } from "mysql2";

/**
 * A tag related to one or more animes.
 */
export interface IAnimeTag extends RowDataPacket {
    id: number;
    tag: string;
    dataAdded: Date;
    dataUpdated: Date;
};

/**
 * A relationship between a tag and anime.
 */
export interface ITagBinding extends RowDataPacket {
    id: number;
    animeId: number;
    tagId: number;
    dataAdded: Date;
    dataUpdated: Date;
};

