import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
const crypto = require("crypto");

export const sellixWebsocket = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const signature = crypto
		.createHmac("sha512", config.SELLIX_WEBHOOK_SECRET)
		.update(req.body)
		.digest("hex");
	const headerSignature = req.headers["x-sellix-unescaped-signature"];
	console.log(headerSignature);

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
