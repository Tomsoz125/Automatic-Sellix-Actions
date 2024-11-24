import { Client } from "discord.js";

let discordClient: Client | null = null;

export const setDiscordClient = (client: Client) => {
	discordClient = client;
};

export const getDiscordClient = () => discordClient;
