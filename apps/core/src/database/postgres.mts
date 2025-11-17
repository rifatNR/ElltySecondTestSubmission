import pg from "pg";
import type { Pool } from "pg";

let pool: Pool;

export const getPostgresPool = (): Pool => {
    if (!pool) {
        pool = new pg.Pool({
            connectionString:
                "postgres://postgres:localghost@ellty-timescaledb:5432/ellty",
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
