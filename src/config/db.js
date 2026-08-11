import mysql from 'mysql2/promise';

const poolConfig = (process.env.DATABASE_URL || process.env.DB_URL)
  ? process.env.DATABASE_URL || process.env.DB_URL
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

const db = mysql.createPool(poolConfig);

export default db;
