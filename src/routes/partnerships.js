const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

router.get('/:id?', (req, res) => {
    const { id } = req.params;
    if (id) {
        db.get('SELECT * FROM partnerships WHERE pid = ?', [id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        });
    } else {
        db.all('SELECT * FROM partnerships', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});

router.post('/', (req, res) => {
    const { company_one, company_two, title, desc, link } = req.body;
    const pid = uuidv4();
    db.run('INSERT INTO partnerships (pid, company_one, company_two, title, desc, link, views, likes) VALUES (?, ?, ?, ?, ?, ?, 0, 0)', 
        [pid, company_one, company_two, title, desc, link], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ pid, company_one, company_two, title, desc, link, views: 0, likes: 0 });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { company_one, company_two, title, desc, link, views, likes } = req.body;
    db.run('UPDATE partnerships SET company_one = ?, company_two = ?, title = ?, desc = ?, link = ?, views = ?, likes = ? WHERE pid = ?', 
        [company_one, company_two, title, desc, link, views, likes, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Partnership updated successfully' });
    });
});

module.exports = router;
