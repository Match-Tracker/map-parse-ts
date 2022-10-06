import { setColors } from './../composables/util';
import Map from '@/composables/map';
import axios from "axios";
import { defineStore } from "pinia";

import type { Kill, Metadata, Players, Round, Teams, Player, Data } from "../types/match";

export const useMatch = defineStore('match', {
	state: () => {
		return {
			matchId: '',
			metadata: {} as Metadata,
			players: {} as Players,
			teams: {} as Teams,
			rounds: [] as Round[],
			kills: [] as Kill[],
			canvas: null as unknown as Map
		}
	},
	actions: {
		async fetchMatch(matchId: string) {
			const data: Data = await $fetch(`https://api.henrikdev.xyz/valorant/v2/match/${matchId}`);

			this.matchId = matchId;
			this.metadata = data.data.metadata;
			this.players = data.data.players;
			this.teams = data.data.teams;
			this.rounds = data.data.rounds;
			this.kills = data.data.kills;
		},

		createCanvas (canvas: HTMLCanvasElement) {
			this.canvas = new Map(this, canvas);

			// Setup Colors of each player in each team
			const players: Player[] = this.players.all_players

			for (const player of players) {
				setColors(player, this.players)
			}
		}
	}
});

export default useMatch;