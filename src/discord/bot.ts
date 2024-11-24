import { Client, GatewayIntentBits } from "discord.js";
import { setDiscordClient } from "../utils/discordClient";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

setDiscordClient(client);

export const startDiscordBot = async (token: string) => {
	try {
		await client.login(token);
		console.log("Discord bot logged in!");
	} catch (error) {
		console.error("Error starting Discord bot:", error);
	}
};
