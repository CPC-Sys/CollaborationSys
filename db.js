import mysql from "mysql2/promise";

const dbPool = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DB,
  port: process.env.DBPORT,
});

export default dbPool;
