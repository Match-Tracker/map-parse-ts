<template>
	<div class="py-12">
		<div class="overview flex flex-row min-w-full justify-center items-start gap-12">
			<div v-if="match.canvas" class="player__menus flex gap-3">
				<PlayerTab :showRed="true" :showBlue="true" @update="playerChange" />
			</div>


			<div class="flex flex-col w-1/3 h-1/3">
				<MapView1 v-if="match.metadata.matchid" />
				<!-- <KillView /> -->

				<RangeSlide @update="rangeUpdate" />
			</div>

			<FilterOptions />
		</div>
	</div>
</template>


<script lang="ts" setup>
import PlayerTab from '~~/components/Players/PlayerTab.vue';
import RangeSlide from '~~/components/Rounds/RangeSlide.vue';

import type { Player } from '@/types/match';
import useMatch from '~~/store/match';
import MapView1 from '../../components/Map/MapView.vue';
import FilterOptions from '~~/components/Filters/FilterOptions.vue';

const matchId: string = useRoute().params.id as string;

const match = useMatch();

let timeRange: number[] = [0, 300];
let curPlayer: Player | null = null;

onMounted(async () => {
	await match.fetchMatch(matchId);
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