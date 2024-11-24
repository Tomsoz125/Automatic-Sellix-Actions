import { Request, Response } from "express";
import { getAllUsers, getUser } from "../services/userService";

export const getUsers = (req: Request, res: Response): void => {
	const users = getAllUsers();
	res.json(users);
};

export const getUserById = (req: Request, res: Response): void => {
	const { id } = req.params;
	const user = getUser(id);
	if (user) {
		res.json(user);
	} else {
		res.status(404).json({ message: "User not found" });
	}
};
