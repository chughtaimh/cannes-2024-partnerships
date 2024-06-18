import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Company } from '../database.js';

const Sequelize = require('sequelize');
const router = express.Router();

// Get all companies or a specific company by ID
router.get('/:id?', async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            const company = await Company.findByPk(id);
            if (company) {
                res.json(company);
            } else {
                res.status(404).json({ error: 'Company not found' });
            }
        } else {
            const companies = await Company.findAll();
            res.json(companies);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new company
router.post('/', async (req, res) => {
    const { name, logo } = req.body;
    const cid = uuidv4();
    try {
        const newCompany = await Company.create({ cid, name, logo: logo || '/src/images/logo.jpeg', views: 0, likes: 0 });
        res.status(201).json(newCompany);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing company by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, logo, views, likes } = req.body;
    try {
        const company = await Company.findByPk(id);
        if (company) {
            await company.update({ name, logo, views, likes });
            res.status(200).json({ message: 'Company updated successfully' });
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a company by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const company = await Company.findByPk(id);
        if (company) {
            await company.destroy();
            res.status(200).json({ message: 'Company deleted successfully' });
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Increment views of a company by ID
router.post('/:id/views', async (req, res) => {
    const { id } = req.params;
    try {
        const company = await Company.findByPk(id);
        if (company) {
            await company.increment('views');
            res.status(200).json({ message: 'Company views incremented successfully' });
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Increment likes of a company by ID
router.post('/:id/likes', async (req, res) => {
    const { id } = req.params;
    try {
        const company = await Company.findByPk(id);
        if (company) {
            await company.increment('likes');
            res.status(200).json({ message: 'Company likes incremented successfully' });
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
