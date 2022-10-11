import axios from "axios";
import MatchSchema from "~/server/db/Match";
import { Data, Match } from '~/types/match';
import { IUser } from "~/server/db/User";

export default defineEventHandler(async event => {
	const user: IUser = event.req["user"];
	console.log(user)
	// Check if the user has an active subscription
	if (!user.subscription.active || user.subscription.expiresAt < new Date()) {
		throw createError({
			statusCode: 403,
			message: "You don't have an active subscription"
		})
	}

	// Get the user's matches
	const match = await MatchSchema.findOne({ "metadata.matchid": event.req.context.params.id });

	if (!match) {
		// Fetch match from API
		try {
			const { data } = await axios.get(`https://api.henrikdev.xyz/valorant/v2/match/${event.req.context.params.id}`)

			// Save match to database
			const newMatch = await MatchSchema.create(data.data);

			return {
				statusCode: 200,
				body: newMatch
			}
		} catch (error) {
			throw createError({
				statusCode: 404,
				message: "Match not found."
			});
		}

	}
	
	return {
		statusCode: 200,
		body: match
	};
});