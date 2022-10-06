<template>
	<div>
		<div v-show="!hasLoaded" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
			<div class="btn btn-ghost btn-lg loading" />
			<p class="text-white mt-1">Loading Match overview...</p>
		</div>
		<div v-if="hasLoaded" class="overview flex flex-row min-w-full justify-center items-start gap-12">
			<div v-if="match.canvas" class="player__menus flex gap-3">
				<PlayersPlayerTab :showRed="true" :showBlue="true" @update="playerChange" />
			</div>


			<div class="flex flex-col w-1/3 h-1/3">
				<MatchOverview class="mx-auto mb-6" />

				<MapView v-if="match.metadata.matchid" />
				<!-- <KillView /> -->

				<RangeSlide class="mt-4" @update="rangeUpdate" />
			</div>

			<FiltersFilterOptions />
		</div>
	</div>
</template>


<script lang="ts" setup>
import RangeSlide from '~~/components/Rounds/RangeSlide.vue';

import type { Player } from '@/types/match';
import useMatch from '~~/store/match';
import { Ref } from 'vue';

const matchId: string = useRoute().params.id as string;
const match = useMatch();
const hasLoaded: Ref<boolean> = ref(false);

let timeRange: number[] = [0, 300];
let curPlayer: Player | null = null;

onMounted(async () => {
	await match.fetchMatch(matchId);

	hasLoaded.value = true;
})

function rangeUpdate(range: number[]) {
	timeRange = range;
	console.log(timeRange);
	draw(curPlayer, timeRange);
}

function playerChange(player: Player | null) {
	curPlayer = player;
	draw(curPlayer, timeRange);
}

function draw(curPlayer: Player | null, timeRange: number[]) {
	match.canvas.clearCanvas();

	if (curPlayer === null) {
		for (curPlayer of match.players.all_players) {
			match.canvas.drawMovementMap(curPlayer, timeRange, false);
		}
	} else {
		match.canvas.drawMovementMap(curPlayer, timeRange, false);
	}
}
</script>

<style scoped>
.btn.loading.btn-lg:before {
	height: 4rem;
	width: 4rem;
	border-width: 6px;
	animation: spin 1s linear infinite;
}
</style>