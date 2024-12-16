import { config as dotenv } from "dotenv";
dotenv();

export const config = {
	PORT: process.env.PORT || 25596,
	BOT_TOKEN: process.env.BOT_TOKEN || "",
	allowedSellixIps: ["99.81.24.41"],
	stores: {
		"xaviiw10": {
			name: "Xavii",
			colour: "#77187c",
			donoInvite: "https://discord.gg/xaviitrios",
			channelId: "1315200976906489856",
			webhookSecret: process.env.XAVII_WH || "",
			heartEmoji: "🩷",
			categories: ["1312475981063127207", "1317586680508842065"],
			ping: "1312475769196253255",
			discordId: "711597574389235734",
			disputeChannel: "1312476173389008978",
			disputeCategories: ["1312476025497845850"],
			disputePing: "<@&1312475762774900876><@&1312475764398100530><@&1312475765551534182><@&1312475766864482345><@&1312475767921311814>"
		},
		vitalityw10: {
			name: "Vitality Trios",
			colour: "#f11313",
			donoInvite: "https://discord.gg/jEyzn3zSKy",
			channelId: "1228702864788947064",
			webhookSecret: process.env.VITALITY_WH || "",
			heartEmoji: "🧡",
			categories: ["1312004983310254113"],
			ping: "938025265995583528",
			discordId: "932586440188104724",
			disputeChannel: "1312099900313436191",
			disputeCategories: ["1312100484621795348"],
			disputePing:
				"<@&937915616902397993><@&1052446269433446480><@&961338893792317500><@&1310420668453486603>"
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
			discordId: string;
			disputeChannel: string;
			disputeCategories: string[];
			disputePing: string;
		};
	};
};
