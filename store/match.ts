import { Match } from './../types/match';
import { setColors } from './../composables/util';
import { defineStore } from "pinia";
import { useToast } from 'vue-toastification/dist/index.mjs'

import Map from '@/composables/map';

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
			const { statusCode, body } = await $fetch<Data>(`/api/matches/${matchId}`);

			if (statusCode && statusCode !== 200) {
				navigateTo('/account/matches')
				useToast().error('You do not have an active subscription.');
				return;
			}
			
			const { metadata, players, teams, rounds, kills } = body as Match;

			this.matchId = matchId;
			this.metadata = metadata;
			this.players = players;
			this.teams = teams;
			this.rounds = rounds;
			this.kills = kills;
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