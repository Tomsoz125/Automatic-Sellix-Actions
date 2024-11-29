import {
	ChannelType,
	Client,
	OverwriteType,
	PermissionFlagsBits
} from "discord.js";

export = async (
	client: Client,
	categories: string[],
	store: any,
	userId: string,
	isDispute = false
) => {
	var existingTicket;
	for (const category of categories) {
		try {
			var ticketCategory = await client.channels.fetch(category);
		} catch (e) {
			console.log(
				`Failed to fetch category for store ${store.name}:\n${e}`
			);
			continue;
		}
		if (!ticketCategory) {
			console.log(`Failed to fetch category for store ${store.name}`);
			continue;
		}
		if (ticketCategory.type !== ChannelType.GuildCategory) {
			console.log(`Failed to fetch category for store ${store.name}`);
			continue;
		}
		for (let t of ticketCategory.children.cache) {
			const ticket = t[1];
			const canUserSee = ticket.permissionOverwrites.cache.find(
				(o) => o.type === OverwriteType.Member && o.id === userId
			);
			if (
				canUserSee &&
				canUserSee.allow.has(PermissionFlagsBits.ViewChannel, false) &&
				canUserSee.allow.has(PermissionFlagsBits.SendMessages, false) &&
				ticket.isSendable() &&
				ticket.isTextBased()
			) {
				existingTicket = ticket;
				break;
			} else if (
				isDispute &&
				ticket.name.includes(userId) &&
				ticket.isSendable() &&
				ticket.isTextBased()
			) {
				existingTicket = ticket;
				break;
			}
		}
	}
	return existingTicket;
};
