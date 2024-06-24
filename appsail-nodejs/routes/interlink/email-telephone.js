import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

router.get('/', async (req, res) => {
    const { pageLink } = req.query;

    try {
        const response = await axios.get(pageLink);
        const $ = cheerio.load(response.data);

        const emailAnchors = [];
        const telephoneAnchors = [];
        const emailPatterns = new Set();
        const telephonePatterns = new Set();

        // Extract emails from anchor tags
        $('a[href^="mailto:"]').each((index, element) => {
            let emailLink = $(element).attr('href').replace('mailto:', '').trim();
            let emailText = $(element).text().trim().replace(/\s+/g, ' ');
            emailAnchors.push({
                text: emailText,
                link: emailLink
            });
        });

        // Extract phone numbers from anchor tags
        $('a[href^="tel:"]').each((index, element) => {
            let telLink = $(element).attr('href').replace('tel:', '').trim();
            let telText = $(element).text().trim().replace(/\s+/g, ' ');
            telephoneAnchors.push({
                text: telText,
                link: telLink
            });
        });

        // Define regular expressions for email and phone numbers
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(\+?\d{1,4}[\s-]?)?(?:\(\d{1,3}\)[\s-]?)?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}/g;

        // Extract emails and phone numbers from the entire page content
        const pageText = $('body').text();

        let emailMatches;
        while ((emailMatches = emailRegex.exec(pageText)) !== null) {
            emailPatterns.add(emailMatches[0]);
        }

        let phoneMatches;
        while ((phoneMatches = phoneRegex.exec(pageText)) !== null) {
            telephonePatterns.add(phoneMatches[0]);
        }

        res.json({
            emails: emailAnchors,
            telephones: telephoneAnchors,
            emailsFromText: Array.from(emailPatterns),
            telephonesFromText: Array.from(telephonePatterns)
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
