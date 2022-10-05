import { Guild } from "~~/server/db/Guild";

export default defineEventHandler(async event => {
	// Get Guild ID
	const user = event.req["user"];

	// Get Guild
	const guilds = await Guild.find({ authorised: user._id });

	// Return Guild
	return guilds.map(guild => guild.guildId);
});