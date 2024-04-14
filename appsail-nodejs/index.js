// import Express from "express";
// const app = Express();
// const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
//   console.log(`http://localhost:${port}/`);
// });

// import Express from "express";
// import https from "https"; // Import the 'https' module directly
// const app = Express();
// const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

// app.get('/server-response', (req, res) => {
//     const pageLink = req.query['page-link'];

//     if (!pageLink) {
//         return res.status(400).json({ error: 'Missing page-link query parameter' });
//     }

//     https.get(pageLink, (response) => { // Use 'https' directly without 'require'
//         res.json({
//             status: response.statusCode,
//             'content-type': response.headers['content-type'],
//             'redirected-url': response.headers.location || pageLink
//         });
//     }).on('error', (error) => {
//         res.status(500).json({ 
//             status: '500',
//             'content-type': 'No Response from server',
//             'redirected-url': 'Nil'
//          });
//     });
// });

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
//     console.log(`http://localhost:${port}/`);
// });

// export default app; // Export the 'app' object if needed


import Express from "express";
import https from "https"; // Import the 'https' module directly
import axios from 'axios';
import cheerio from 'cheerio';
import { URL } from 'url';

const app = Express();
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

app.get('/server-response', (req, res) => {
    const pageLink = req.query['page-link'];

    if (!pageLink) {
        return res.status(400).json({ error: 'Missing page-link query parameter' });
    }

    https.get(pageLink, (response) => { // Use 'https' directly without 'require'
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

app.get('/fetch-anchor', async (req, res) => {
    const { pageLink } = req.query;

    try {
        const response = await axios.get(pageLink);
        const $ = cheerio.load(response.data);

        const anchors = [];
        //const baseUrl = new URL(pageLink).origin;
        const baseUrl = new URL(pageLink).origin + new URL(pageLink).pathname;
        

        $('a').each((index, element) => {
            let link = $(element).attr('href');
            if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
                link = new URL(link, baseUrl).href;
            }

            let text = $(element).text().trim(); // Remove extra whitespace and newline characters
            text = text.replace(/\s+/g, ' '); // Replace multiple whitespace characters with a single space

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app; // Export the 'app' object if needed



// import Express from "express";
// import https from "https";
// import axios from 'axios';
// import cheerio from 'cheerio';
// import { URL } from 'url';

// const app = Express();
// const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

// app.get('/webpage-crawl', async (req, res) => {
//     const pageLink = req.query['page-link'];

//     if (!pageLink) {
//         return res.status(400).json({ error: 'Missing page-link query parameter' });
//     }

//     try {
//         const mainPageResponse = await axios.get(pageLink);
//         const mainPageStatus = mainPageResponse.status;
//         const mainPageRedirectedUrl = mainPageResponse.request.res.responseUrl;

//         const $ = cheerio.load(mainPageResponse.data);

//         const anchors = [];
//         const baseUrl = new URL(pageLink).origin;

//         $('a').each((index, element) => {
//             let link = $(element).attr('href');
//             if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
//                 link = new URL(link, baseUrl).href;
//             }

//             let text = $(element).text().trim();
//             text = text.replace(/\s+/g, ' ');

//             anchors.push({
//                 'anchor-text': text,
//                 'anchor-link': link
//             });
//         });

//         const anchorRequests = anchors.map(async (anchor) => {
//             try {
//                 const response = await axios.head(anchor['anchor-link']);
//                 anchor['anchor-status'] = response.status;
//                 anchor['anchor-redirection-link'] = response.request.res.responseUrl;
//             } catch (error) {
//                 anchor['anchor-status'] = 'Error';
//                 anchor['anchor-redirection-link'] = 'Nil';
//             }
//         });

//         await Promise.all(anchorRequests);

//         res.json({
//             'page-link': pageLink,
//             'status': mainPageStatus,
//             'redirection-url': mainPageRedirectedUrl,
//             'page-anchor-link': anchors
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

// export default app;
