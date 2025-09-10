require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'YourPassword123',
    database: process.env.DB_NAME || 'shopbarber_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      options: {
        encrypt: false, // Use this if you're on Windows Azure
        trustServerCertificate: true, // Use this if you're using self-signed certificates
        enableArithAbort: true,
        instanceName: process.env.DB_INSTANCE_NAME || undefined,
      },
      requestTimeout: 30000,
      connectionTimeout: 30000,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
  },
  test: {
    username: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'YourPassword123',
    database: process.env.DB_NAME + '_test' || 'shopbarber_db_test',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      },
    },
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 1433,
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
      },
    },
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
  },
};