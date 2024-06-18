import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Partnership } from '../database.js';

const router = express.Router();

// Get all partnerships or a specific partnership by ID
router.get('/:id?', async (req, res) => {
    const { id } = req.params;
    const { tags } = req.query;
    try {
        if (id) {
            const partnership = await Partnership.findByPk(id);
            if (partnership) {
                res.json(partnership);
            } else {
                res.status(404).json({ error: 'Partnership not found' });
            }
        } else if (tags) {
            const partnerships = await Partnership.findAll({
                where: {
                    tags: {
                        [Sequelize.Op.like]: `%${tags}%`,
                    },
                },
            });
            res.json(partnerships);
        } else {
            const partnerships = await Partnership.findAll();
            res.json(partnerships);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new partnership
router.post('/', async (req, res) => {
    const { company_one, company_two, title, desc, link, image, tags } = req.body;
    const pid = uuidv4();
    try {
        const newPartnership = await Partnership.create({ pid, company_one, company_two, title, desc, link, image: image || '/src/images/logo.jpeg', tags: tags || '', views: 0, likes: 0 });
        res.status(201).json(newPartnership);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing partnership by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { company_one, company_two, title, desc, link, image, tags, views, likes } = req.body;
    try {
        const partnership = await Partnership.findByPk(id);
        if (partnership) {
            await partnership.update({ company_one, company_two, title, desc, link, image, tags, views, likes });
            res.status(200).json({ message: 'Partnership updated successfully' });
        } else {
            res.status(404).json({ error: 'Partnership not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a partnership by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const partnership = await Partnership.findByPk(id);
        if (partnership) {
            await partnership.destroy();
            res.status(200).json({ message: 'Partnership deleted successfully' });
        } else {
            res.status(404).json({ error: 'Partnership not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Increment views of a partnership by ID
router.post('/:id/views', async (req, res) => {
    const { id } = req.params;
    try {
        const partnership = await Partnership.findByPk(id);
        if (partnership) {
            await partnership.increment('views');
            res.status(200).json({ message: 'Partnership views incremented successfully' });
        } else {
            res.status(404).json({ error: 'Partnership not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Increment likes of a partnership by ID
router.post('/:id/likes', async (req, res) => {
    const { id } = req.params;
    try {
        const partnership = await Partnership.findByPk(id);
        if (partnership) {
            await partnership.increment('likes');
            res.status(200).json({ message: 'Partnership likes incremented successfully' });
        } else {
            res.status(404).json({ error: 'Partnership not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
