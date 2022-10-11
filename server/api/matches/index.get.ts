import axios from "axios";
import { APIMatch, Match } from "~~/types/match";

export default defineEventHandler(async event => {
	const user = event.req["user"];

	const query = getQuery(event);
	// If the user is not authed, return an error
	if (!user) {
		return createError({
			statusCode: 401,
			message: "You need to be logged in to access this route."
		})
	}

	// Get the user's matches
	const { data } = await axios.get(`https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/${query.region}/${query.puuid}?filter=${query.filter}`);

	// Parse through the matches and only return 
	const matches: Match[] = data.data
	const cleanedMatches: APIMatch[] = matches.map(match => {
		return {
			map: match.metadata.map,
			length: match.metadata.game_length,
			rounds: match.metadata.rounds_played,
			date: match.metadata.game_start,
			mode: match.metadata.mode,
			matchId: match.metadata.matchid,
			score: {
				red: match.teams.red.rounds_won,
				blue: match.teams.blue.rounds_won
			}
		}
	});




	return cleanedMatches;
});