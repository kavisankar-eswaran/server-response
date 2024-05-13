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


// import Express from "express";
// import https from "https"; // Import the 'https' module directly
// import axios from 'axios';
// import cheerio from 'cheerio';
// import { URL } from 'url';

// const app = Express();
// const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

// app.get('/server-response', (req, res) => {
//   const pageLink = req.query['page-link'];

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

// app.get('/fetch-anchor', async (req, res) => {
//     const { pageLink } = req.query;

//     try {
//         const response = await axios.get(pageLink);
//         const $ = cheerio.load(response.data);

//         const anchors = [];
//         //const baseUrl = new URL(pageLink).origin;
//         const baseUrl = new URL(pageLink).origin + new URL(pageLink).pathname;
        

//         $('a').each((index, element) => {
//             let link = $(element).attr('href');
//             if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
//                 link = new URL(link, baseUrl).href;
//             }

//             let text = $(element).text().trim(); // Remove extra whitespace and newline characters
//             text = text.replace(/\s+/g, ' '); // Replace multiple whitespace characters with a single space

//             anchors.push({
//                 text,
//                 link
//             });
//         });

//         res.json(anchors);
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// export default app; // Export the 'app' object if needed



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



import express from "express";
import bodyParser from "body-parser";
import https from "https";
import axios from 'axios';
import cheerio from 'cheerio';
import { URL } from 'url';

const app = express();
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

let jsonOutput = { "product": "gofrugal", "page-list": [] };

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/page-json', (req, res) => {
    if (req.query.edit === 'dev') {
        res.send(`
            <form action="/page-json" method="post" style="
            
            
            max-width: 700px;
            padding: 100px 15px;
            margin: 0 auto;
            ">

                <h2 style="margin-bottom:30px;">Please enter the page link one by one</h2>
                <textarea name="links" rows="15" cols="60" style="
                
                font-size: 12px;
                padding: 10px 0px 10px 7px;
                background: #f7f7f76d;
                color: #6a6a6a;
                border: 1px solid #000;
                margin-bottom: 30px;

                   
                }
                
                
                ">
                </textarea><br>
                <input type="submit" value="Submit" style="
                    font-size: 16px;
                    background-color: #000;
                    color: #fff;
                    padding: 15px 25px;
                    border: none;
                    text-decoration: none;
                    font-weight: 500;
                    cursor: pointer;
                
                ">
            </form>
        `);
    } else {
        res.json(jsonOutput);
    }
});

app.post('/page-json', (req, res) => {
    const links = req.body.links.split('\n').filter(Boolean);
    jsonOutput["page-list"] = []; // Remove existing data
    for (let i = 0; i < links.length; i++) {
        const link = links[i].trim();
        let title = "";
        if (link.includes(" - ")) {
            [title, link] = link.split(" - ");
        } else if (link.includes("/")) {
            title = "page#" + (i + 1);
        }
        jsonOutput["page-list"].push({ "Title": title.trim(), "Link": link.trim() });
    }
    res.send('JSON updated successfully');
});


app.get('/server-response', (req, res) => {
    const pageLink = req.query['page-link'];

    if (!pageLink) {
        return res.status(400).json({ error: 'Missing page-link query parameter' });
    }

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

app.get('/fetch-anchor', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;
