import pg from "pg";
import type { Pool } from "pg";

let pool: Pool;

export const getPostgresPool = (): Pool => {
    if (!pool) {
        pool = new pg.Pool({
            // connectionString: "postgres://postgres:localghost@ellty-timescaledb:5432/ellty",
            connectionString: process.env.DATABASE_URL,
            max: 20,
        });
    }
    return pool;
};

export const closePool = (): void => {
    getPostgresPool().end(() => {
        console.log("Pool has ended");
    });
};
