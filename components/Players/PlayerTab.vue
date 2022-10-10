<template>
	<div class="flex flex-col gap-4">
		<ul class="menu bg-neutral w-56 rounded-box">
			<li v-for="(player, index) in match.players[team.toLowerCase()]" :key="index" @click="drawMovements(player)">
				<div :class="`${isActive(player) ? 'active' : ''} items-center`">
					<img class="w-6 h-6 rounded-full" :src="importImage(`agents/${match.canvas.fetchAgent(player)}.png`)" />
					<p>{{ player.name }}</p>
					<div class="rounded-full w-2 h-2 ml-auto" :style="`background-color: hsl(${player.color})`" />
				</div>
			</li>
		</ul>

		<div class="flex justify-between">
			<button class="btn text-accent btn-xs btn-outline rounded-full normal-case" @click="selectAll">
				<span class="text-white">All</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { type Ref } from 'vue';
import type { Player, Team } from '@/types/match';

import { useFilter } from '~~/store/filter';
import useMatch from '@/store/match';

const match = useMatch();
const filter = useFilter();

const props = defineProps<{
	team: Team;
}>();

const activePlayers: Ref<Player[]> = ref(match.players[props.team.toLowerCase()]);

function importImage (path: string) {
	const href = new URL(`/img/${path}`, import.meta.url).href;
	return href
}

function drawMovements (player: Player) {
	if (activePlayers.value.some(p => p.puuid === player.puuid)) {
		activePlayers.value = activePlayers.value.filter(p => p.puuid != player.puuid);
	} else {
		activePlayers.value.push(player);
	}
	
	filter.updateFilter('players', activePlayers.value);
}

function isActive (player: Player) {
	return activePlayers.value.some(p => p.puuid === player.puuid)
}

function selectAll () {
	if (activePlayers.value.length === 5) {
		activePlayers.value = [];
	} else {
		activePlayers.value = match.players[props.team.toLowerCase()];
	}

	filter.updateFilter('players', activePlayers.value);
}
</script>