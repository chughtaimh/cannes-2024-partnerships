import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve('db/database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS companies (
        cid TEXT PRIMARY KEY,
        name TEXT,
        logo TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS partnerships (
        pid TEXT PRIMARY KEY,
        company_one TEXT,
        company_two TEXT,
        title TEXT,
        desc TEXT,
        link TEXT,
        image TEXT,
        tags TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        FOREIGN KEY (company_one) REFERENCES companies (cid),
        FOREIGN KEY (company_two) REFERENCES companies (cid)
    )`);
});

export default db;
