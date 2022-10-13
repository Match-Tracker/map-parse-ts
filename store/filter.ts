import { useMatch } from './match';
import { defineStore } from 'pinia'
import { RoundOutcome, Side, TradedFilter, Timing } from '~/types/filters';
import { Player, PlantSite, DamageWeaponNameEnum } from '~/types/match';
import { match } from 'assert';

export const useFilter = defineStore('filter', {
	state: () => {
		return {
			roundTimeRange: [0, 150],
			minRoundNumber: 0,
			maxRoundNumber: 30,
			side: Side.All,
			players: [],
			roundOutcome: RoundOutcome.All,
			hasPlanted: undefined,
			plantedAt: PlantSite.All,
			firstBlood: false,
			drawHeatmap: false,
			traded: TradedFilter.All,
			rounds: [],
			timing: Timing.All,
			weapons: []
		}
	},
	actions: {
		updateFilter(key: string, value: any) {
			this[key] = value;

			const match = useMatch();

			if (match.canvas) {
				match.canvas.update(this);
			}
		},

		changeTab(tab: string) {
			const match = useMatch();

			match.canvas.setMode(tab);
			match.canvas.update(this);
		}
	}
})