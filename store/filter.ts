import { useMatch } from './match';
import { defineStore } from 'pinia'
import { KillTime, RoundOutcome, Side } from '~/types/filters';
import { Player, PlantSite } from '~/types/match';
import { match } from 'assert';

export const useFilter = defineStore('filter', {
	state: () => {
		return {
			roundTimeRange: [0, 150] as number[],
			minRoundNumber: 0 as number,
			maxRoundNumber: 30 as number,
			side: Side.All as Side,
			players: [] as Player[],
			roundOutcome: RoundOutcome.All as RoundOutcome,
			hasPlanted: undefined as boolean,
			plantedAt: PlantSite.All as PlantSite,
			killTime: KillTime.All as string,
			drawHeatmap: false as boolean,
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