import axios from "axios";
import { defineStore } from "pinia";

import type { Kill, Metadata, Players, Round, Teams } from "../types/match";

// SWITCH OUT WITH OUR OWN API
const API_URL = "https://api.henrikdev.xyz/valorant/v2"

export const useMatch = defineStore('match', {
	state: () => {
		return {
			matchId: '',
			metadata: {} as Metadata,
			players: {} as Players,
			teams: {} as Teams,
			rounds: [] as Round[],
			kills: [] as Kill[]
		}
	},
	actions: {
		async fetchMatch(matchId: string) {
			const { data } = await axios.get(`${API_URL}/match/${matchId}`);

			this.matchId = matchId;
			this.metadata = data.data.metadata;
			this.players = data.data.players;
			this.teams = data.data.teams;
			this.rounds = data.data.rounds;
			this.kills = data.data.kills;
		}
	}
});

export default useMatch;