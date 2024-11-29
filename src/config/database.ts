import { config } from "dotenv";
import mysql from "mysql2/promise";

config(); // Load environment variables

// Create the connection pool
const pool = mysql.createPool({
	host: process.env.MYSQL_HOST || "",
	user: process.env.MYSQL_USER || "",
	port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
	password: process.env.MYSQL_PASSWORD || "",
	database: process.env.MYSQL_DATABASE || "",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

export default pool;
