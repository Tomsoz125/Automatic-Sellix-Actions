import app from "./app";
import { config } from "./config/config";
import { startDiscordBot } from "./discord/bot";

app.listen(config.PORT, () => {
	console.log(`Server is running on port ${config.PORT}`);
});

startDiscordBot(config.BOT_TOKEN);
