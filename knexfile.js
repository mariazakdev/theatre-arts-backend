require('dotenv').config();

module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.MYSQLHOST,
    database: process.env.MYSQLDATABASE,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    charset: process.env.DB_CHARSET,
    port: process.env.MYSQLPORT,
    waitForConnections: true,
  },
  pool: {
    min: 2, 
    max: 10, 
    acquireTimeoutMillis: 10000, 
    idleTimeoutMillis: 30000, 
  },
  migrations: {
    directory: 'migrations',
  },
  seeds: {
    directory: 'seeds',
  },
};
