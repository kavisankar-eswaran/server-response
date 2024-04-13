const express = require('express');
const app = express();

app.get('/server-response', (req, res) => {
    const pageLink = req.query['page-link'];

    if (!pageLink) {
        return res.status(400).json({ error: 'Missing page-link query parameter' });
    }

    const https = require('https');
    https.get(pageLink, (response) => {
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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
