
require('dotenv').config();

module.exports = {
  client: "mysql2",
  connection: 
  
  {
    host: process.env.MYSQLHOST,
    database: process.env.MYSQLDATABASE,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    charset: process.env.DB_CHARSET,
    port: process.env.MYSQL_PRIVATE_URL,
  },
  
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds', 
  },
};