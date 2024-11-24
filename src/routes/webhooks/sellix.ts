import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
	const payload = req.body;
	console.log("Received Sellix webhook:", payload);
	res.status(200).json({ message: "Sellix webhook received" });
});

export default router;
