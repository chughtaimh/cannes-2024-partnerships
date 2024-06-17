const express = require('express');
const app = express();
const db = require('./database');

app.use(express.json());

const companiesRouter = require('./routes/companies');
const partnershipsRouter = require('./routes/partnerships');

app.use('/company', companiesRouter);
app.use('/partnership', partnershipsRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;
