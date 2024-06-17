import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

client.query(`
    CREATE TABLE IF NOT EXISTS companies (
        cid UUID PRIMARY KEY,
        name TEXT,
        logo TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS partnerships (
        pid UUID PRIMARY KEY,
        company_one UUID,
        company_two UUID,
        title TEXT,
        desc TEXT,
        link TEXT,
        image TEXT,
        tags TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        FOREIGN KEY (company_one) REFERENCES companies (cid),
        FOREIGN KEY (company_two) REFERENCES companies (cid)
    );
`);

export default client;
