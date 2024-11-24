export = <T extends object, K extends keyof T>(
	obj: T,
	key: K,
	defaultValue: T[K]
): T[K] => {
	return key in obj ? obj[key] : defaultValue;
};
