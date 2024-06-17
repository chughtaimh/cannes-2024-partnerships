const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

router.get('/:id?', (req, res) => {
    const { id } = req.params;
    if (id) {
        db.get('SELECT * FROM companies WHERE cid = ?', [id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        });
    } else {
        db.all('SELECT * FROM companies', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});

router.post('/', (req, res) => {
    const { name } = req.body;
    const cid = uuidv4();
    db.run('INSERT INTO companies (cid, name, views, likes) VALUES (?, ?, 0, 0)', [cid, name], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ cid, name, views: 0, likes: 0 });
    });
});

module.exports = router;
