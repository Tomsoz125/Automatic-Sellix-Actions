import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

// Path to the webhooks directory
const webhooksPath = path.join(__dirname);

// Dynamically load all webhook folders
fs.readdirSync(webhooksPath).forEach((folder) => {
	const folderPath = path.join(webhooksPath, folder);
	const stats = fs.lstatSync(folderPath);
	// Check if the item is a directory and has an index.ts
	if (
		stats.isDirectory() &&
		(fs.existsSync(path.join(folderPath, "index.ts")) ||
			fs.existsSync(path.join(folderPath, "index.js")))
	) {
		const webhookRouter = require(path.join(
			folderPath,
			"index.ts"
		)).default;
		console.log(`/${folder}`);
		router.use(`/${folder}`, webhookRouter);
	}
});

export default router;
