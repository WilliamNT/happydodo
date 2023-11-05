import express, { Request, Response } from 'express';
import { createApiError } from '../utils/errors';
import { getPool } from '../db';
import { RowDataPacket } from 'mysql2';
import { AnimeDto } from '../dto/anime_dto';
import { IApiMessage } from '../models/api_message';
import { mapToAnimeDto } from '../utils/dto_mapping';

const feed = express.Router()

feed.get('/search/:searchString', async (req: Request, res: Response<IApiMessage | AnimeDto[]>) => {
    const searchString = req.params.searchString;
    if (!searchString || searchString.length < 3) {
        return res.status(400).json(createApiError(400, 'query too short'));
    }

    const pool = getPool().promise();
    const con = await pool.getConnection();

    const query = `
    SELECT DISTINCT animes.*, GROUP_CONCAT(DISTINCT synonyms.synonym) AS synonym_list, GROUP_CONCAT(DISTINCT tags.tag) AS tag_list
    FROM animes
    LEFT JOIN synonyms ON synonyms.anime_id = animes.id
    LEFT JOIN tag_bindings ON tag_bindings.anime_id = animes.id
    LEFT JOIN tags ON tags.id = tag_bindings.tag_id
    WHERE MATCH(animes.title) AGAINST(?) OR MATCH(synonyms.synonym) AGAINST(?)
    GROUP BY animes.id
    ORDER BY animes.title
    LIMIT 25;
    `;

    const [rows] = await con.query<RowDataPacket[]>(query, [searchString, searchString]);
    pool.releaseConnection(con);

    const results: AnimeDto[] = rows.map((row) => mapToAnimeDto(row));
    return res.json(results);
});

feed.get('/random', async (req: Request, res: Response<IApiMessage | AnimeDto>) => {
    const pool = getPool().promise();
    const con = await pool.getConnection();

    const query = `
    SELECT animes.*, GROUP_CONCAT(DISTINCT synonyms.synonym) AS synonyms, GROUP_CONCAT(DISTINCT tags.tag) AS tags
    FROM animes
    LEFT JOIN synonyms ON synonyms.anime_id = animes.id
    LEFT JOIN tag_bindings ON tag_bindings.anime_id = animes.id
    LEFT JOIN tags ON tags.id = tag_bindings.tag_id
    WHERE animes.description IS NOT NULL 
    GROUP BY animes.id ORDER BY RAND() LIMIT 1;
    `;

    const [rows] = await con.query<RowDataPacket[]>(query);
    pool.releaseConnection(con);

    return res.json(mapToAnimeDto(rows[0]));
});

feed.get('/', async (req: Request, res: Response<IApiMessage | AnimeDto[]>) => {
    const pool = getPool().promise();
    const con = await pool.getConnection();

    const [_rows] = await con.query<RowDataPacket[]>('SELECT COUNT(*) as possibilities FROM animes WHERE description IS NOT NULL;');
    const count = _rows[0].possibilities;
    const ids = Array.from({length: 50}, () => Math.floor(Math.random() * count));

    const query = `
    SELECT animes.*, GROUP_CONCAT(DISTINCT synonyms.synonym) AS synonyms, GROUP_CONCAT(DISTINCT tags.tag) AS tags
    FROM animes
    LEFT JOIN synonyms ON synonyms.anime_id = animes.id
    LEFT JOIN tag_bindings ON tag_bindings.anime_id = animes.id
    LEFT JOIN tags ON tags.id = tag_bindings.tag_id
    WHERE animes.id IN (${ids.join(',')}) AND animes.description IS NOT NULL 
    GROUP BY animes.id;
    `;

    const [rows] = await con.query<RowDataPacket[]>(query);
    pool.releaseConnection(con);
    
    const animes: AnimeDto[] = rows.map((row) => mapToAnimeDto(row));
    res.json(animes);
});

export default feed;