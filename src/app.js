// app.js
import express from 'express';
import path from 'path';
import db from './database.js';
import companiesRouter from './routes/companies.js';
import partnershipsRouter from './routes/partnerships.js';

const app = express();
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/company', companiesRouter);
app.use('/partnership', partnershipsRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

export default app;
