import { config as dotenv } from "dotenv";
dotenv();

export const config = {
	PORT: process.env.PORT || 25596,
	BOT_TOKEN: process.env.BOT_TOKEN || "",
	allowedSellixIps: ["99.81.24.41"],
	stores: {
		"dros-haven": {
			name: "Dro's Haven",
			colour: "#4de0f9",
			donoInvite: "https://discord.gg/hvndonos",
			channelId: "1299108148900139100",
			webhookSecret: process.env.DROS_WH || "",
			heartEmoji: "💙",
			categories: [],
			ping: ""
		},
		vitalityw10: {
			name: "Vitality Trios",
			colour: "#f11313",
			donoInvite: "https://discord.gg/jEyzn3zSKy",
			channelId: "1228702864788947064",
			webhookSecret: process.env.VITALITY_WH || "",
			heartEmoji: "🧡",
			categories: ["1312004983310254113"],
			ping: "938025265995583528"
		}
	}
} as {
	PORT: number;
	BOT_TOKEN: string;
	allowedSellixIps: string[];
	stores: {
		[key: string]: {
			name: string;
			colour: string;
			donoInvite: string;
			webhookSecret: string;
			channelId: string;
			heartEmoji: string;
			categories: string[];
			ping: string;
		};
	};
};
