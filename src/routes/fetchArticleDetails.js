import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const router = express.Router();

router.post('/', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        const { document } = dom.window;

        const title = document.querySelector('meta[property="og:title"]')?.content || document.title;
        const bodyText = document.querySelector('meta[property="og:description"]')?.content || document.querySelector('body')?.textContent;
        const imageUrl = document.querySelector('meta[property="og:image"]')?.content || '';

        res.json({
            title,
            body_text: bodyText,
            url,
            image_url: imageUrl
        });
    } catch (error) {
        console.error('Error fetching article details:', error);
        res.status(500).json({ error: 'Failed to fetch article details' });
    }
});

export default router;
