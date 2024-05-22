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

        const emailAnchors = [];
        const telephoneAnchors = [];

        $('a[href^="mailto:"]').each((index, element) => {
            let emailLink = $(element).attr('href');
            let emailText = $(element).text().trim().replace(/\s+/g, ' ');
            emailAnchors.push({
                text: emailText,
                link: emailLink
            });
        });

        $('a[href^="tel:"]').each((index, element) => {
            let telLink = $(element).attr('href');
            let telText = $(element).text().trim().replace(/\s+/g, ' ');
            telephoneAnchors.push({
                text: telText,
                link: telLink
            });
        });

        res.json({
            emails: emailAnchors,
            telephones: telephoneAnchors
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
