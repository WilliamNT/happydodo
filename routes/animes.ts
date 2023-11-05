import express, { Request, Response } from 'express';
import { getPool } from '../db';
import { createApiError } from '../utils/errors';
import { IApiMessage } from '../models/api_message';
import { AnimeDto } from '../dto/anime_dto';
import { IAnime } from '../models/anime';
import { MappingDto } from '../dto/mapping_dto';
import { IProviderMapping } from '../models/mapping';
import { mapToAnimeDto, mapToMappingDto } from '../utils/dto_mapping';

const animes = express.Router();

animes.get('/:id', async (req: Request, res: Response<IApiMessage | AnimeDto>) => {
    const id = req.params.id;
    if (!id || isNaN(parseInt(id, 10))) {
        return res.status(400).json(createApiError(400, 'invalid id'));
    }
    
    const pool = getPool().promise();
    const con = await pool.getConnection();

    const query = `
    SELECT animes.*, GROUP_CONCAT(DISTINCT synonyms.synonym) AS synonyms, GROUP_CONCAT(DISTINCT tags.tag) AS tags
    FROM animes
    LEFT JOIN synonyms ON synonyms.anime_id = animes.id
    LEFT JOIN tag_bindings ON tag_bindings.anime_id = animes.id
    LEFT JOIN tags ON tags.id = tag_bindings.tag_id
    WHERE animes.id = ? AND animes.description IS NOT NULL 
    GROUP BY animes.id;    
    `;

    const [rows] = await con.query<IAnime[]>(query, [id]);
    pool.releaseConnection(con);
    
    if (rows.length === 0) {
        return res.status(404).json(createApiError(404, 'Anime not found'));
    }

    res.json(mapToAnimeDto(rows[0]));
});

animes.get('/:id/mappings', async (req: Request, res: Response<IApiMessage | MappingDto>) => {
    const id = req.params.id;
    if (!id || isNaN(parseInt(id, 10))) {
        return res.status(400).json(createApiError(400, 'invalid id'));
    }
    
    const pool = getPool().promise();
    const con = await pool.getConnection();

    const query = `SELECT * FROM mappings WHERE anime_id = ?`;
    const [rows] = await con.query<IProviderMapping[]>(query, [id]);
    pool.releaseConnection(con);

    if (rows.length === 0) {
        return res.status(404).json(createApiError(404, 'Anime not found'));
    }

    return res.json(mapToMappingDto(rows[0]));
});

animes.get('/:id/related', async (req: Request, res: Response<IApiMessage | MappingDto[]>) => {
    const id = req.params.id;
    if (!id || isNaN(parseInt(id, 10))) {
        return res.status(400).json(createApiError(400, 'invalid id'));
    }
    
    const pool = getPool().promise();
    const con = await pool.getConnection();

    const query = `SELECT * FROM relation_mappings WHERE anime_id = ?`;
    const [rows] = await con.query<IProviderMapping[]>(query, [id]);
    pool.releaseConnection(con);

    if (rows.length === 0) {
        return res.status(404).json(createApiError(404, 'Anime not found'));
    }

    const results = rows.map((row) => mapToMappingDto(row));
    return res.json(results);
});

export default animes;