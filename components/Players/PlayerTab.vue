<template>
	<div class="flex flex-col gap-4">
		<ul v-show="showBlue" class="menu bg-neutral w-56 rounded-box">
			<li v-for="(player, index) in match.players.blue" :key="index" @click="drawMovements(player)">
				<div :class="`${curPlayer == player ? 'active' : ''} items-center`">
					<img class="w-6 h-6 rounded-full" :src="importImage(`agents/${match.canvas.fetchAgent(player)}.png`)" />
					<p>{{ player.name }}</p>
					<div class="rounded-full w-2 h-2 ml-auto" :style="`background-color: hsl(${player.color})`" />
				</div>
			</li>
		</ul>

		<ul v-show="showRed" class="menu bg-neutral w-56 rounded-box">
			<li v-for="(player, index) in match.players.red" :key="index" @click="drawMovements(player)">
				<div :class="`${curPlayer == player ? 'active' : ''} items-center`">
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
const curPlayer: Ref<Player | null> = ref(null);

defineProps<{
	showBlue: boolean;
	showRed: boolean;
}>();

const emit = defineEmits<{(e: 'update', id: Player | null): Player | null}>()

function importImage (path: string) {
	const href = new URL(`/assets/img/${path}`, import.meta.url).href;
	return href
}

function drawMovements (player: Player) {
	if (curPlayer.value && player.puuid === curPlayer.value.puuid) {
		curPlayer.value = null;
		emit("update", null)
	} else {
		curPlayer.value = player;
		emit("update", player)
	}
}
</script>