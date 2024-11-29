import { Client } from "discord.js";

export default async (
	payload: any,
	store: any,
	client: Client
): Promise<void> => {
	console.log(payload);
};
