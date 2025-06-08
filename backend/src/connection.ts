import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const connection = knex({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: { rejectUnauthorized: false },
        connectTimeout: 10000
    },
    pool: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 30000 
    }
});

export default connection;
