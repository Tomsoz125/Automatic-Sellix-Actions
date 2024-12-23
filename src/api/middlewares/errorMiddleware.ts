// middlewares/errorMiddleware.ts
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	console.error(err.stack);
	res.status(500).json({ message: "Internal Server Error" });
};
