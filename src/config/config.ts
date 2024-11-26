import { config as dotenv } from "dotenv";
dotenv();

export const config = {
	PORT: process.env.PORT || 25596,
	DATABASE_URL: process.env.DATABASE_URL || "",
	BOT_TOKEN: process.env.BOT_TOKEN || "",
	donoInvite: "https://discord.gg/hvndonos",
	stores: {
		"Dros-Haven": {
			name: "Dro's Haven",
			colour: "#4de0f9",
			channelId: "1299108148900139100",
			webhookSecret: "XUrg0PWXfGy3oe4TZuUOo3ckflG0NPV9",
			heartEmoji: "💙"
		}
	}
} as {
	PORT: number;
	DATABASE_URL: string;
	BOT_TOKEN: string;
	donoInvite: string;
	stores: {
		[key: string]: {
			name: string;
			colour: string;
			webhookSecret: string;
			channelId: string;
			heartEmoji: string;
		};
	};
};
