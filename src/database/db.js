const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log("Attempting to connect with User:", process.env.DB_USER);
console.log("Target Database:", process.env.DB_NAME);
// Helper to log connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};