import { config as dotenv } from "dotenv";
dotenv();

export const config = {
	PORT: process.env.PORT || 25596,
	BOT_TOKEN: process.env.BOT_TOKEN || "",
	donoInvite: "https://discord.gg/hvndonos",
	allowedSellixIps: ["99.81.24.41"],
	stores: {
		"Dros-Haven": {
			name: "Dro's Haven",
			colour: "#4de0f9",
			channelId: "1299108148900139100",
			webhookSecret: process.env.DROS_WS_SECRET || "",
			heartEmoji: "💙"
		}
	}
} as {
	PORT: number;
	BOT_TOKEN: string;
	donoInvite: string;
	allowedSellixIps: string[];
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
