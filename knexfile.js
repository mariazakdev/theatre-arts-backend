require('dotenv').config();

module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.MYSQLHOST,
    database: process.env.MYSQLDATABASE,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    charset: process.env.DB_CHARSET || "utf8mb4",
    port: process.env.MYSQLPORT || 3306,
    timezone: "-05:00", // Use UTC offset for EST (Winter)
    waitForConnections: true,
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    afterCreate: (conn, done) => {
      conn.query("SET time_zone = '-05:00';", (err) => {
        if (err) {
          console.error("Failed to set time zone:", err);
        }
        done(err, conn);
      });
    },
  },
  migrations: {
    directory: "./migrations",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};
