import { useMatch } from './match';
import { defineStore } from 'pinia'
import { RoundOutcome, Side } from '~/types/filters';
import { Player, PlantSite } from '~/types/match';

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
			PlantSite: PlantSite.All as PlantSite
    }
  },
  actions: {
    updateFilter(key: string, value: any) {
			this[key] = value;

			const match = useMatch();

			if (match.canvas) {
				match.canvas.update(this);
			}
		}
  }
})