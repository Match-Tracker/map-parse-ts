

import { Guild } from "~~/server/db/Guild";
import { Snapshot } from "~~/server/db/Snapshot";

export default defineEventHandler(async event => {
	// Get Guild ID
	const user = event.req["user"];

	// Get Guild
	const guild = await Guild.findOne({ id: event.context.params.id });

	if (!guild) {
		return sendError(event, createError({ statusCode: 400, message: 'Could not find a Guild with that ID' }));
	}

	if (guild.authorised.length === 0) {
		guild.authorised.push(user._id);

		await guild.save();
	}

	if (!guild.authorised.includes(user._id)) {
		return sendError(event, createError({ statusCode: 401, message: 'Unauthorized' }));
	}

	if (!guild.active) {
		guild.active = true;

		await guild.save();
	}
	
	const snapshot = await Snapshot.findOne({ guildId: guild.guildId }, 'memberCount updatedAt').lean();

	// Return Guild
	return { ...guild.toObject(), ...snapshot };
});