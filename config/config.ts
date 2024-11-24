import { config as dotenv } from "dotenv";
dotenv();

export const config = {
	PORT: process.env.PORT || 3000,
	DATABASE_URL: process.env.DATABASE_URL || ""
};
