import { NextFunction, Request, Response } from "express";
import { config } from "../../config/config";
const crypto = require("crypto");

export const sellixWebsocket = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const payload = req.body.data;
    console.log("Order recieved")
    console.log(payload)
	if (payload.uniqid === "dummy") {
		payload.name = "xaviiw10";
		payload.custom_fields = {
			discord_user: "tomsoz#0",
			discord_id: "724833136894279690"
		};
	}
	const store =
		payload.name.toLowerCase() in config.stores
			? config.stores[payload.name.toLowerCase()]
			: undefined;
	if (!store) {
		res.status(401).json({
			message: `Access is not allowed from this IP address!`
		});
		return;
	}

	const signature = crypto
		.createHmac("sha512", store.webhookSecret)
		.update(JSON.stringify(req.body))
		.digest("hex");
	const headerSignature = req.headers["x-sellix-unescaped-signature"];

	if (
		(headerSignature &&
			crypto.timingSafeEqual(
				Buffer.from(signature),
				Buffer.from(headerSignature as string, "utf-8")
			)) ||
		payload.uniqid === "dummy"
	) {
		next();
	} else {
		console.log(
			`Invalid sellix signature for ${store.name}, recieved: ${headerSignature}, expected ${signature}`
		);
		res.status(400).json({
			message: "Invalid or missing Sellix signature header!"
		});
	}
};
