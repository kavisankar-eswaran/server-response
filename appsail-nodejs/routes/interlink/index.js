import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import { URL } from 'url';

const router = express.Router();

router.get('/', async (req, res) => {
    const { pageLink } = req.query;

    try {
        const response = await axios.get(pageLink);
        const $ = cheerio.load(response.data);

        const anchors = [];
        const baseUrl = new URL(pageLink).origin + new URL(pageLink).pathname;

        $('a').each((index, element) => {
            let link = $(element).attr('href');
            if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
                link = new URL(link, baseUrl).href;
            }

            let text = $(element).text().trim();
            text = text.replace(/\s+/g, ' ');

            anchors.push({
                text,
                link
            });
        });

        res.json(anchors);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
