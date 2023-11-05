import { RowDataPacket } from "mysql2";

/**
 * An alternative title for the anime with id `animeId`.
 */
export interface IAnimeSynonym extends RowDataPacket {
    id: number;
    animeId: number;
    synonym: string;
    dataAdded: Date;
    dataUpdated: Date;
};