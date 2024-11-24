import { Router } from "express";
import userRoutes from "./userRoutes";
import webhookRoutes from "./webhooks";

const router = Router();

router.use("/users", userRoutes);

router.use("/webhooks", webhookRoutes);

export default router;
