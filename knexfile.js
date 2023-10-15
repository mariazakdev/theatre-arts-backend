
require('dotenv').config();

module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: process.env.DB_CHARSET,
    port: process.env.DB_PORT,
  },
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds', 
  },
};