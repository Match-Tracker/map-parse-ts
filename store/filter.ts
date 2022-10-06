import { useMatch } from './match';
import { defineStore } from 'pinia'
import { Side } from '~/types/filters';
import { Player } from '~/types/match';

export const useFilter = defineStore('filter', {
  state: () => {
    return {
			roundTimeRange: [0, 150] as number[],
			minRoundNumber: 0 as number,
			maxRoundNumber: 30 as number,
			side: Side.All as Side,
			players: [] as Player[],
			hasPlanted: undefined as boolean,
    }
  },
  actions: {
    updateFilter(key: string, value: any) {
			this[key] = value;

			console.log(this.players)
			const match = useMatch();

			if (match.canvas) {
				match.canvas.update(this);
			}
		}
  }
})