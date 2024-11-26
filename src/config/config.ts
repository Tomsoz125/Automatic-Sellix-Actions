import { config as dotenv } from "dotenv";
dotenv();

export const config = {
	PORT: process.env.PORT || 25596,
	DATABASE_URL: process.env.DATABASE_URL || "",
	SELLIX_WEBHOOK_SECRET: process.env.SELLIX_WEBHOOK_SECRET || "",
	BOT_TOKEN: process.env.BOT_TOKEN || "",
	donoInvite: "https://discord.gg/hvndonos",
	stores: { "Dros-Haven": { name: "Dro's Haven" } }
} as {
	PORT: number;
	DATABASE_URL: string;
	SELLIX_WEBHOOK_SECRET: string;
	BOT_TOKEN: string;
	donoInvite: string;
	stores: { [key: string]: { name: string } };
};
