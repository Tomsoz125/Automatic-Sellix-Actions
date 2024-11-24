import { User } from "../models/userModel";

const users: User[] = [
	{ id: "1", name: "Alice" },
	{ id: "2", name: "Bob" }
];

export const getAllUsers = (): User[] => users;

export const getUser = (id: string): User | undefined =>
	users.find((user) => user.id === id);
