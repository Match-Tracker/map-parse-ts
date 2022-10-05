import type { Player, Players } from './../types/match';

// Generate 10 flat HSL Hues
const COLORS = [
	"5, 83%, 53%",
	"240, 100%, 48%",
	"105, 58%, 29%",
	"27, 86%, 57%",
	"279, 92%, 55%",
	"60, 100%, 66%",
	"119, 80%, 55%",
	"209, 100%, 53%",
	"182, 38%, 49%",
	"300, 100%, 75%"
];

export const setColors = (player: Player, players: Players) => {
	// Function that generates a unique color for each player using HSL
	const color = COLORS[players.all_players.indexOf(player)];

	const isBlueTeam = players.blue.find((p) => p.puuid === player.puuid);
	const isRedTeam = players.red.find((p) => p.puuid === player.puuid);

	if (isBlueTeam) {
		isBlueTeam.color = color;
	} else if (isRedTeam) {
		isRedTeam.color = color;
	}

	player.color = color;
}