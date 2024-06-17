import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import db from './database.js';
import companiesRouter from './routes/companies.js';
import partnershipsRouter from './routes/partnerships.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('./src/public'));

// Serve images from the 'src/images' directory
app.use('/images', express.static('./src/images'));

app.use('/company', companiesRouter);
app.use('/partnership', partnershipsRouter);

app.get('/', (req, res) => {
    res.sendFile('./src/public/index.html', { root: __dirname });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
}

export default app;
