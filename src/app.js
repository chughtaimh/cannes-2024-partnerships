import express from 'express';
import { sequelize } from './database.js';
import companyRoutes from './routes/companies.js';
import partnershipRoutes from './routes/partnerships.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/companies', companyRoutes);
app.use('/partnerships', partnershipRoutes);

// Sync all models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Unable to create database:', err);
  });

// Serve static files from the 'public' directory
app.use(express.static('./src/public'));

// Serve images from the 'src/images' directory
app.use('/images', express.static('./src/images'));

app.get('/', (req, res) => {
    res.sendFile('./src/public/index.html', { root: __dirname });
});

export default app;
