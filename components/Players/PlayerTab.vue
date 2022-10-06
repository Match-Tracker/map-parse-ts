<template>
	<div class="flex flex-col gap-4">
		<ul v-show="showBlue" class="menu bg-neutral w-56 rounded-box">
			<li v-for="(player, index) in match.players.blue" :key="index" @click="drawMovements(player)">
				<div :class="`${activePlayers.includes(player) ? 'active' : ''} items-center`">
					<img class="w-6 h-6 rounded-full" :src="importImage(`agents/${match.canvas.fetchAgent(player)}.png`)" />
					<p>{{ player.name }}</p>
					<div class="rounded-full w-2 h-2 ml-auto" :style="`background-color: hsl(${player.color})`" />
				</div>
			</li>
		</ul>

		<ul v-show="showRed" class="menu bg-neutral w-56 rounded-box">
			<li v-for="(player, index) in match.players.red" :key="index" @click="drawMovements(player)">
				<div :class="`${activePlayers.includes(player) ? 'active' : ''} items-center`">
					<img class="w-6 h-6 rounded-full" :src="importImage(`agents/${match.canvas.fetchAgent(player)}.png`)" />
					<p>{{ player.name }}</p>
					<div class="rounded-full w-2 h-2 ml-auto" :style="`background-color: hsl(${player.color})`" />
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { type Ref } from 'vue';

import useMatch from '@/store/match';
import type { Player } from '@/types/match';
import { useFilter } from '~~/store/filter';

const match = useMatch();
const filter = useFilter();

const activePlayers: Ref<Player[]> = ref([]);

defineProps<{
	showBlue: boolean;
	showRed: boolean;
}>();

function importImage (path: string) {
	const href = new URL(`/assets/img/${path}`, import.meta.url).href;
	return href
}

function drawMovements (player: Player) {
	if (activePlayers.value.includes(player)) {
		activePlayers.value = activePlayers.value.filter(p => p.puuid != player.puuid);

		if (activePlayers.value.length === 0) {
			filter.updateFilter('players', match.players.all_players);
			return;
		}
	} else {
		activePlayers.value.push(player);
	}
	
	filter.updateFilter('players', activePlayers.value);
}
</script>