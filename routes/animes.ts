import express, { Request, Response } from 'express';
import { getPool } from '../db';
import { createApiError } from '../utils/errors';
import { Anime } from '../models/anime';
import { ApiMessage } from '../models/api_message';
import { AnimeDto } from '../dto/anime_dto';
import { AnimeSynonym } from '../models/synonym';
import { AnimeTag } from '../models/tag';
import { MappingDto } from '../dto/mapping_dto';
import { ProviderMapping, RelationMapping } from '../models/mapping';

const animes = express.Router();

/**
 * Responds with the show whose id was provided.
 * 
 * If the show doesn't exist, a HTTP 404 is returned.
 */
animes.get("/animes/:id", async (req: Request, res: Response<ApiMessage | AnimeDto>) => {
    const id = req.params.id;
    if (!id || isNaN(parseInt(id, 10))) {
        return res.status(400).json(createApiError(400, 'invalid id'));
    }

    const pool = getPool();

    pool.getConnection((e, c) => {
        if (e) {
            res.status(500).json(createApiError(500));
            throw e;
        };

        c.query('SELECT * FROM animes WHERE id = ?;', [id], (_e, r: Anime[]) => {
            if (_e) {
                res.status(500).json(createApiError(500));
                throw e;
            }

            if (Array.isArray(r) && r.length === 0) {
                return res.status(404).json(createApiError(404, 'Anime not found'));
            }

             // We don't need these yet
             const anime = {...r[0]};

            c.query('SELECT tag FROM tags LEFT JOIN tag_bindings ON tag_bindings.tag_id = tags.id WHERE tag_bindings.anime_id = ?;', [id], (_e, r) => {
                if (_e) {
                    res.status(500).json(createApiError(500));
                    throw _e
                }

                const tags = r.map((t: any) => {
                    return t.tag;
                });

                c.query('SELECT synonym FROM synonyms WHERE anime_id = ?;', [id], (_e, r) => {
                    if (_e) {
                        res.status(500).json(createApiError(500));
                        throw _e
                    }

                    const synonyms = r.map((s: any) => {
                        return s.synonym
                    });

                    return res.json({
                        isError: false,
                        id: anime.id,
                        title: anime.title,
                        synonyms: synonyms,
                        description: anime.description,
                        tags: tags,
                        year: anime.year,
                        status: anime.status,
                        type: anime.type,
                        episodes: anime.episodes,
                        season: anime.season,
                        rating: anime.rating,
                        poster: `${process.env.POSTER_BASEPATH}${anime.poster_filename}`,
                        thumbnail: `${process.env.THUMBNAIL_BASEPATH}${anime.thumbnail_filename}`
                    });
                })
            });
        });
    });
});

animes.get("/animes/:id/mappings", async (req: Request, res: Response<ApiMessage | MappingDto>) => {
    const id = req.params.id;
    if (!id || isNaN(parseInt(id, 10))) {
        return res.status(400).json(createApiError(400, 'invalid id'));
    }

    const pool = getPool();

    pool.getConnection((e, c) => {
        if (e) {
            res.status(500).json(createApiError(500));
            throw e;
        };
        
        c.query('SELECT * FROM mappings WHERE mappings.anime_id = ?;', [id], (_e, r: ProviderMapping[]) => {
            if (_e) {
                res.status(500).json(createApiError(500));
                throw e;
            }

            if (Array.isArray(r) && r.length === 0) {
                return res.status(404).json(createApiError(404, 'Anime not found'));
            }

            const data = {...r[0]}
            return res.json({
                anidb: data.anidb ? parseInt(data.anidb, 10) : undefined,
                anilist: data.anilist ? parseInt(data.anilist, 10) : undefined,
                animeplanet: data.animeplanet,
                anisearch: data.anisearch ? parseInt(data.anisearch, 10) : undefined,
                kitsu: data.kitsu ? parseInt(data.kitsu, 10) : undefined,
                livechart: data.livechart ? parseInt(data.livechart, 10) : undefined,
                myanimelist: data.myanimelist ? parseInt(data.myanimelist, 10) : undefined,
                notifymoe: data.notifymoe
            });
        })
    });
})

animes.get("/animes/:id/related", async (req: Request, res: Response<ApiMessage | MappingDto[]>) => {
    const id = req.params.id;
    if (!id || isNaN(parseInt(id, 10))) {
        return res.status(400).json(createApiError(400, 'invalid id'));
    }

    const pool = getPool();

    pool.getConnection((e, c) => {
        if (e) {
            res.status(500).json(createApiError(500));
            throw e;
        };
        
        c.query('SELECT * FROM relation_mappings WHERE relation_mappings.anime_id = ?;', [id], (_e, r: RelationMapping[]) => {
            if (_e) {
                res.status(500).json(createApiError(500));
                throw e;
            }

            if (Array.isArray(r) && r.length === 0) {
                return res.status(404).json(createApiError(404, 'Relations not found'));
            }

            const data: MappingDto[] = r.map((rel) => {
                return {
                    anidb: rel.anidb ? parseInt(rel.anidb, 10) : undefined,
                    anilist: rel.anilist ? parseInt(rel.anilist, 10) : undefined,
                    animeplanet: rel.animeplanet,
                    anisearch: rel.anisearch ? parseInt(rel.anisearch, 10) : undefined,
                    kitsu: rel.kitsu ? parseInt(rel.kitsu, 10) : undefined,
                    livechart: rel.livechart ? parseInt(rel.livechart, 10) : undefined,
                    myanimelist: rel.myanimelist ? parseInt(rel.myanimelist, 10) : undefined,
                    notifymoe: rel.notifymoe
                }
            })

            return res.json(data);
        })
    });
})

/**
 * Searches for an anime and returns up to N results.
 */
animes.get("/search/:query", async (req: Request, res: Response<ApiMessage | AnimeDto[]>) => {
    const query = req.params.query;
    if (!query || query.length < 3) {
        return res.status(400).json(createApiError(400, 'invalid query'))
    }

    const pool = getPool();
    const command = `
    SELECT DISTINCT animes.*, GROUP_CONCAT(DISTINCT synonyms.synonym) AS synonym_list, GROUP_CONCAT(DISTINCT tags.tag) AS tag_list
    FROM animes
    LEFT JOIN synonyms ON synonyms.anime_id = animes.id
    LEFT JOIN tag_bindings ON tag_bindings.anime_id = animes.id
    LEFT JOIN tags ON tags.id = tag_bindings.tag_id
    WHERE MATCH(animes.title) AGAINST(?) OR MATCH(synonyms.synonym) AGAINST(?)
    GROUP BY animes.id
    ORDER BY animes.title
    LIMIT 25;
    `

    pool.getConnection((e, c) => {
        if (e) {
            res.status(500).json(createApiError(500));
            throw e;
        };

        c.query(command, [query, query], (_e, r) => {
            if (e) {
                res.status(500).json(createApiError(500));
                throw e;
            };

            if (Array.isArray(r) && r.length === 0) {
                return res.json([]);
            }

            console.log(process.env.POSTER_BASEPATH)

            const data: AnimeDto[] = r.map((a: any) => {
                const synonyms: AnimeSynonym[] = a.synonym_list ? a.synonym_list.split(',') : [];
                const tags: AnimeTag[] = a.tag_list ? a.tag_list.split(',') : [];
            
                return {
                    isError: false,
                    id: a.id,
                    title: a.title,
                    synonyms: synonyms,
                    description: a.description,
                    tags: tags,
                    year: a.year,
                    status: a.status,
                    type: a.type,
                    episodes: a.episodes,
                    season: a.season,
                    rating: a.rating,
                    poster: `${process.env.POSTER_BASEPATH}${a.poster_filename}`,
                    thumbnail: `${process.env.THUMBNAIL_BASEPATH}${a.thumbnail_filename}`
                };
            });            

            return res.json(data);
        });
    });
});

animes.get("/feed", async (req: Request, res: Response<ApiMessage | AnimeDto[]>) => {
    const pool = getPool();
    pool.getConnection((e, c) => {
        if (e) {
            res.status(500).json(createApiError(500));
            throw e;
        };

        c.query('SELECT COUNT(*) FROM animes WHERE description IS NOT NULL;', (_e, r) => {
            if (_e) {
                res.status(500).json(createApiError(500));
                throw e;
            }

            const count = parseInt(r[0]['COUNT(*)'], 10);

            const ids = Array.from({length: 50}, () => Math.floor(Math.random() * count));

            // thanks chatgpt
            let q = `
            SELECT animes.*, GROUP_CONCAT(DISTINCT synonyms.synonym) AS synonyms, GROUP_CONCAT(DISTINCT tags.tag) AS tags
            FROM animes
            LEFT JOIN synonyms ON synonyms.anime_id = animes.id
            LEFT JOIN tag_bindings ON tag_bindings.anime_id = animes.id
            LEFT JOIN tags ON tags.id = tag_bindings.tag_id
            WHERE animes.id IN (${ids.join(',')}) AND animes.description IS NOT NULL 
            GROUP BY animes.id;            
            `;

            c.query(q, [ids], (_e, r: any[]) => {
                const data: AnimeDto[] = r.map((anime) => {
                    return {
                        id: anime.id,
                        title: anime.title,
                        synonyms: anime.synonyms ? anime.synonyms.split(',') : null,
                        description: anime.description,
                        tags: anime.tags ? anime.tags.split(',') : null,
                        year: anime.year,
                        status: anime.status,
                        type: anime.type,
                        episodes: anime.episodes,
                        season: anime.season,
                        rating: anime.rating,
                        poster: `${process.env.POSTER_BASEPATH}${anime.poster_filename}`,
                        thumbnail: `${process.env.THUMBNAIL_BASEPATH}${anime.thumbnail_filename}`
                    };
                });
                

                res.send(data);
            })
        });
    });
});

export default animes;