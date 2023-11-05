import mysql, { Pool } from 'mysql2';

let pool: Pool;

export function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            connectionLimit: 200,
            connectTimeout: 10,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }

    return pool;
}