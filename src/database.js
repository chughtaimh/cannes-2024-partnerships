const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, '../db/database.db');
const db = new sqlite3.Database(dbPath);

// Initialize database schema
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS companies (
        cid TEXT PRIMARY KEY,
        name TEXT,
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
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        FOREIGN KEY (company_one) REFERENCES companies (cid),
        FOREIGN KEY (company_two) REFERENCES companies (cid)
    )`);
});

module.exports = db;
