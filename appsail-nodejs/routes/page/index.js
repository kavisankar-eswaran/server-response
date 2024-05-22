import express from 'express';

const router = express.Router();

let jsonOutput = { "product": "gofrugal", "page-list": [] };

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
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

export default router;
