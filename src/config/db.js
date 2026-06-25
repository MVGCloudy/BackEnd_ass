const mysql = require("mysql2/promise");
require("dotenv").config();

const useSsl = process.env.DB_SSL === "true";

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  user: process.env.DB_USER || process.env.MYSQLUSER || "root",
  password:
    process.env.DB_PASSWORD ||
    process.env.MYSQLPASSWORD ||
    process.env.MYSQL_ROOT_PASSWORD ||
    "",
  database:
    process.env.DB_NAME || process.env.MYSQLDATABASE || "food_and_drink",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  ...(useSsl ? { ssl: { rejectUnauthorized: true } } : {}),
});

pool.testConnection = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
};

module.exports = pool;
