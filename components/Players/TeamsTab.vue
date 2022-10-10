<template>
	<div class="flex flex-col gap-4">
		<ul v-show="showBlue" class="menu bg-neutral w-56 rounded-box">
			<li v-for="(player, index) in match.players.blue" :key="index" @click="drawMovements(player)">
				<div :class="`${isActive(player) ? 'active bg-blue-500 active:bg-blue-500' : ''} items-center`">
					<img class="w-6 h-6 rounded-full" :src="importImage(`agents/${match.canvas.fetchAgent(player)}.png`)" />
					<p>{{ player.name }}</p>
					<div class="rounded-full w-2 h-2 ml-auto" :style="`background-color: hsl(${player.color})`" />
				</div>
			</li>
		</ul>

		<ul v-show="showRed" class="menu bg-neutral w-56 rounded-box">
			<li v-for="(player, index) in match.players.red" :key="index" @click="drawMovements(player)">
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
			<button class="btn text-blue-500 btn-xs btn-outline rounded-full normal-case" @click="selectTeam('blue')">
				<span class="text-white">Blue Team</span>
			</button>
			<button class="btn btn-primary btn-xs btn-outline rounded-full normal-case" @click="selectTeam('red')">
				<span class="text-white">Red Team</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { type Ref } from 'vue';

import useMatch from '@/store/match';
import type { Player } from '@/types/match';
import { useFilter } from '~~/store/filter';

const match = useMatch();
const filter = useFilter();

const activePlayers: Ref<Player[]> = ref(match.players.all_players);

defineProps<{
	showBlue: boolean;
	showRed: boolean;
}>();

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
	if (activePlayers.value.length === 10) {
		activePlayers.value = [];
	} else {
		activePlayers.value = match.players.blue.concat(match.players.red);
	}

	filter.updateFilter('players', activePlayers.value);
}

function selectTeam (team: 'blue' | 'red') {
	if (activePlayers.value.filter(p => p.team.toString().toLowerCase() === team).length === 5) {
		activePlayers.value = activePlayers.value.filter(p => p.team.toString().toLowerCase() !== team);
	} else {
		activePlayers.value.push(...match.players[team]);
	}


	filter.updateFilter('players', activePlayers.value);
}
</script>