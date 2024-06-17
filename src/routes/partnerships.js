import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

const router = express.Router();

// Get all partnerships or a specific partnership by ID
router.get('/:id?', (req, res) => {
    const { id } = req.params;
    const { tags } = req.query;

    let sql = 'SELECT * FROM partnerships';
    let params = [];

    if (id) {
        sql += ' WHERE pid = ?';
        params.push(id);
    } else if (tags) {
        sql += ' WHERE tags LIKE ?';
        params.push(`%${tags}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// Create a new partnership
router.post('/', (req, res) => {
    const { company_one, company_two, title, desc, link, image, tags } = req.body;
    const pid = uuidv4();
    db.run('INSERT INTO partnerships (pid, company_one, company_two, title, desc, link, image, tags, views, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)', 
           [pid, company_one, company_two, title, desc, link, image || '/src/images/logo.jpeg', tags || ''], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ pid, company_one, company_two, title, desc, link, image: image || '/src/images/logo.jpeg', tags: tags || '', views: 0, likes: 0 });
    });
});

// Update an existing partnership by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { company_one, company_two, title, desc, link, image, tags, views, likes } = req.body;
    db.run('UPDATE partnerships SET company_one = ?, company_two = ?, title = ?, desc = ?, link = ?, image = ?, tags = ?, views = ?, likes = ? WHERE pid = ?', 
           [company_one, company_two, title, desc, link, image, tags, views, likes, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Partnership updated successfully' });
    });
});

// Delete a partnership by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM partnerships WHERE pid = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Partnership deleted successfully' });
    });
});

// Increment views of a partnership by ID
router.post('/:id/views', (req, res) => {
    const { id } = req.params;
    db.run('UPDATE partnerships SET views = views + 1 WHERE pid = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Partnership views incremented successfully' });
    });
});

// Increment likes of a partnership by ID
router.post('/:id/likes', (req, res) => {
    const { id } = req.params;
    db.run('UPDATE partnerships SET likes = likes + 1 WHERE pid = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Partnership likes incremented successfully' });
    });
});

export default router;
