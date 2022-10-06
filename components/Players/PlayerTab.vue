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

const match = useMatch();
const activePlayers: Ref<Player[]> = ref([]);

defineProps<{
	showBlue: boolean;
	showRed: boolean;
}>();

const emit = defineEmits<{(e: 'update', id: Player[] | []): Player[] | null}>()

function importImage (path: string) {
	const href = new URL(`/assets/img/${path}`, import.meta.url).href;
	return href
}

function drawMovements (player: Player) {
	if (activePlayers.value.includes(player)) {
		activePlayers.value = activePlayers.value.filter(p => p.puuid != player.puuid);
	} else {
		activePlayers.value.push(player);
	}
	emit("update", activePlayers.value);
}
</script>