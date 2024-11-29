export = (name: string) =>
	name
		.toLowerCase() // Convert to lowercase
		.trim() // Remove leading/trailing whitespace
		.replace(/[^a-z0-9\s]/g, "") // Remove special characters except spaces
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.substring(0, 100);
