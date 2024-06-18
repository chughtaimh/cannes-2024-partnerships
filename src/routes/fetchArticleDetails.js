import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        const { document } = dom.window;

        const title = document.querySelector('meta[property="og:title"]')?.content || document.title;
        const bodyText = document.querySelector('meta[property="og:description"]')?.content || document.querySelector('body')?.textContent.trim();
        const imageUrl = document.querySelector('meta[property="og:image"]')?.content || '';

        const prompt = `I'm going to submit to you an article about a partnership. Your job is to summarize key parts of this partnership and return them in a json dictionary with the following FORMAT:\n\nFORMAT\n{\n"company_one": Name of first company participating in partnership (usually the lead company),\n"company_two": Name of second company participating in partnership,\n"title": 80 characters or less, summarizing the most important parts of the partnership (focus who is partnering and a brief description of the partnership\n"desc": 250 characters or less, summarizing the most important parts of the partnership (focus on what the partnership actually _does_,\n"image": use IMAGE_URL below,\n"link": use URL below,\n"tags": generate the most relevant tags for this article, no more than 5. If the partnership is related to TV/Video/CTV, include a label for 'tv'; if it is related to retail media or commerce add a label for 'commerce'; otherwise generate relevant tags(Format all lower-case, comma-separated).\n}\n\nTITLE\n${title}\n\nBODY\n${bodyText}\n\nURL\n${url}\n\nIMAGE_URL\n${imageUrl}\n\nNOTE: ensure your response is **ONLY** the json_object. Do not add any other response besides the json_object. Think very carefully about this, step-by-step. Before providing an answer, double-check your work to ensure you're providing a response in the format I want. Do not provide any extra info or text besides the json_object.`;

        const openAIResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an assistant that summarizes articles about partnerships."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const summary = JSON.parse(openAIResponse.data.choices[0].message.content);
        console.log(summary)

        res.json(summary);

    } catch (error) {
        console.error('Error fetching article details or processing with OpenAI:', error);
        res.status(500).json({ error: 'Failed to fetch article details or process with OpenAI' });
    }
});

export default router;
