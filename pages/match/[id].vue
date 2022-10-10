<template>
	<div>
		<div v-show="!hasLoaded" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
			<div class="btn btn-ghost btn-lg loading" />
			<p class="text-white mt-1">Loading Match overview...</p>
		</div>
		<div v-if="hasLoaded" class="overview flex flex-row min-w-full justify-center items-start gap-12">
			<div v-if="match.canvas" class="player__menus flex gap-3">
				<!-- <PlayersPlayerTab :team="team" /> -->
				<PlayersTeamsTab :showRed="true" :showBlue="true" />
			</div>


			<div class="flex flex-col w-1/3 h-1/3">
				<MatchOverview class="mx-auto mb-6" />

				<MapView v-if="match.metadata.matchid" />

				<RangeSlide class="mt-4" />
			</div>

			<FiltersFilterOptions />
		</div>
	</div>
</template>


<script lang="ts" setup>
import RangeSlide from '~~/components/Rounds/RangeSlide.vue';
import useMatch from '~~/store/match';

import { Ref } from 'vue';
import { useAuth } from '~~/store/auth';
import { Team } from '~~/types/match';

const matchId: string = useRoute().params.id as string;
const match = useMatch();
const auth = useAuth();

const hasLoaded: Ref<boolean> = ref(false);
const team: Ref<Team> = ref(Team.Blue);

onMounted(async () => {
	await match.fetchMatch(matchId);

	if (match.metadata && match.metadata.matchid) {
		hasLoaded.value = true;

		team.value = match.players.all_players.find((player) => auth.user.riotAccounts.some((account) => account.puuid === player.puuid)).team;
	}
})
</script>

<style scoped>
.btn.loading.btn-lg:before {
	height: 4rem;
	width: 4rem;
	border-width: 6px;
	animation: spin 1s linear infinite;
}
</style>