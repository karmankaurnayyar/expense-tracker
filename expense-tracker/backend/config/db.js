// config/db.js – Creates and exports a MySQL connection pool
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "expense_tracker",
  waitForConnections: true,
  connectionLimit:    10,    // max simultaneous connections
  queueLimit:         0,
});

// Quick connectivity test on startup
pool.getConnection()
  .then(conn => {
    console.log("✅  MySQL connected");
    conn.release();
  })
  .catch(err => {
    console.error("❌  MySQL connection failed:", err.message);
    process.exit(1);
  });

module.exports = pool;
