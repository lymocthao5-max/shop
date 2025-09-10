const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
    logging: dbConfig.logging,
    define: dbConfig.define,
  }
);

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Service = require('./Service')(sequelize, Sequelize.DataTypes);
const Barber = require('./Barber')(sequelize, Sequelize.DataTypes);
const Booking = require('./Booking')(sequelize, Sequelize.DataTypes);
const Customer = require('./Customer')(sequelize, Sequelize.DataTypes);

// Define associations
const models = {
  User,
  Service,
  Barber,
  Booking,
  Customer,
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};