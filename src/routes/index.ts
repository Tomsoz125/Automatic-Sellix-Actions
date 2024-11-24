import { Router } from "express";
import fs from "fs";
import path from "path";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/users", userRoutes);

const webhooksPath = path.join(__dirname, "webhooks");
fs.readdirSync(webhooksPath).forEach((file) => {
	if (file.endsWith(".ts") || file.endsWith(".js")) {
		const routeName = file.replace(/\.[tj]s$/, ""); // Remove extension
		const route = require(path.join(webhooksPath, file)).default;
		router.use(`/webhooks/${routeName}`, route);
	}
});

export default router;
