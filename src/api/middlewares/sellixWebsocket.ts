import { NextFunction, Request, Response } from "express";
import { config } from "../../config/config";
const crypto = require("crypto");

export const sellixWebsocket = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const requestIp = req.ip;
	if (!requestIp || !config.allowedSellixIps.includes(requestIp)) {
		return;
	}

	const payload = req.body.data;
	const store =
		payload.name in config.stores ? config.stores[payload.name] : undefined;
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
		headerSignature &&
		crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(headerSignature as string, "utf-8")
		)
	) {
		next();
	} else {
		res.status(400).json({
			message: "Invalid or missing Sellix signature header!"
		});
	}
};
