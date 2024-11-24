import { config as dotenv } from "dotenv";
dotenv();

export const config = {
	PORT: process.env.PORT || 25596,
	DATABASE_URL: process.env.DATABASE_URL || "",
	SELLIX_WEBHOOK_SECRET: process.env.SELLIX_WEBHOOK_SECRET || "",
	BOT_TOKEN: process.env.BOT_TOKEN || ""
};
