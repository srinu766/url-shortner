const { Pool } =  require("pg");
const dotenv =  require("dotenv");
dotenv.config();

const pool = new Pool({
  // user: "postgres",
  // password: "root",
  // host: "localhost",
  // port: 5432,
  // database: "url_shortener", 

  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // database: process.env.DB_NAME,
  connectionString : process.env.DB_URL,
  ssl: process.env.NODE_ENV === "production" ? {rejectUnauthorized: false} : false
});

module.exports = pool
