import { RowDataPacket } from "mysql2";
import { AnimeDto } from "../dto/anime_dto";
import { MappingDto } from "../dto/mapping_dto";

export function mapToAnimeDto(row: RowDataPacket): AnimeDto {
    let tags = [];
    if (row.tag_list !== undefined) {
        tags = row.tag_list ? row.tag_list.split(',') : [];
    } else if (row.tags !== undefined) (
        tags = row.tags ? row.tags.split(',') : []
    )

    let synonyms = [];
    if (row.synonym_list !== undefined) {
        synonyms = row.synonym_list ? row.synonym_list.split(',') : [];
    } else if (row.synonyms !== undefined) (
        synonyms = row.synonyms ? row.synonyms.split(',') : []
    )


    return {
        id: row.id,
        title: row.title,
        synonyms: synonyms,
        description: row.description,
        tags: tags,
        year: row.year,
        status: row.status,
        type: row.type,
        episodes: row.episodes,
        season: row.season,
        rating: row.rating,
        poster: `${process.env.POSTER_BASEPATH}${row.poster_filename}`,
        thumbnail: `${process.env.THUMBNAIL_BASEPATH}${row.thumbnail_filename}`
    }
}

export function mapToMappingDto(row: RowDataPacket): MappingDto {
    return {
        anidb: row.anidb ? parseInt(row.anidb, 10) : undefined,
        anilist: row.anilist ? parseInt(row.anilist, 10) : undefined,
        animeplanet: row.animeplanet,
        anisearch: row.anisearch ? parseInt(row.anisearch, 10) : undefined,
        kitsu: row.kitsu ? parseInt(row.kitsu, 10) : undefined,
        livechart: row.livechart ? parseInt(row.livechart, 10) : undefined,
        myanimelist: row.myanimelist ? parseInt(row.myanimelist, 10) : undefined,
        notifymoe: row.notifymoe
    }
}