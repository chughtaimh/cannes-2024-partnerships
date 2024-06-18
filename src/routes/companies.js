import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Company } from '../database.js';

const router = express.Router();

// Get all companies or a specific company by ID
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

// Create a new company
router.post('/', (req, res) => {
    const { name, logo } = req.body;
    const cid = uuidv4();
    db.run('INSERT INTO companies (cid, name, logo, views, likes) VALUES (?, ?, ?, 0, 0)', [cid, name, logo || '/src/images/logo.jpeg'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ cid, name, logo: logo || '/src/images/logo.jpeg', views: 0, likes: 0 });
    });
});

// Update an existing company by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, logo, views, likes } = req.body;
    db.run('UPDATE companies SET name = ?, logo = ?, views = ?, likes = ? WHERE cid = ?', [name, logo, views, likes, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Company updated successfully' });
    });
});

// Delete a company by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM companies WHERE cid = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Company deleted successfully' });
    });
});

// Increment views of a company by ID
router.post('/:id/views', (req, res) => {
    const { id } = req.params;
    db.run('UPDATE companies SET views = views + 1 WHERE cid = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Company views incremented successfully' });
    });
});

// Increment likes of a company by ID
router.post('/:id/likes', (req, res) => {
    const { id } = req.params;
    db.run('UPDATE companies SET likes = likes + 1 WHERE cid = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Company likes incremented successfully' });
    });
});

export default router;
