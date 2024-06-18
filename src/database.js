import { Sequelize, DataTypes } from 'sequelize';

// Create a new Sequelize instance for PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Heroku
    },
  },
});

// Define the Company model
const Company = sequelize.define('company', {
  cid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  logo: {
    type: DataTypes.STRING,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'companies',
  timestamps: false,
});

// Define the Partnership model
const Partnership = sequelize.define('partnership', {
  pid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  company_one: {
    type: DataTypes.STRING,
    references: {
      model: Company,
      key: 'cid',
    },
  },
  company_two: {
    type: DataTypes.STRING,
    references: {
      model: Company,
      key: 'cid',
    },
  },
  title: {
    type: DataTypes.STRING,
  },
  desc: {
    type: DataTypes.TEXT,
  },
  link: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.STRING,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'partnerships',
  timestamps: false,
});

// Sync all models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Unable to create database:', err);
  });

export { sequelize, Company, Partnership };
