import express from 'express';
import bodyParser from 'body-parser';
import { URL } from 'url';
import pageRoutes from './routes/page/index.js';
import httpRoutes from './routes/http/index.js';
import interlinkRoutes from './routes/interlink/index.js';
import emailTelephoneRoutes from './routes/interlink/email-telephone.js';
import formAutoSubmitRoutes from './routes/form-submit/index.js';

const app = express();
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/page-json', pageRoutes);
app.use('/server-response', httpRoutes);
app.use('/fetch-anchor', interlinkRoutes);
app.use('/fetch-email-telephone', emailTelephoneRoutes);
app.use('/submit-form', formAutoSubmitRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;
