import express from 'express';
import http from 'http';
import https from 'https';

const router = express.Router();

router.get('/', (req, res) => {
    const pageLink = req.query['page-link'];

    if (!pageLink) {
        return res.status(400).json({ error: 'Missing page-link query parameter' });
    }

    const protocol = pageLink.startsWith('https') ? https : http;

    protocol.get(pageLink, (response) => {
        res.json({
            status: response.statusCode,
            'content-type': response.headers['content-type'],
            'redirected-url': response.headers.location || pageLink
        });
    }).on('error', (error) => {
        res.status(500).json({ 
            status: '500',
            'content-type': 'No Response from server',
            'redirected-url': 'Nil'
        });
    });
});

export default router;
