<template>
	<div class="card bg-neutral">
		<div class="card-body">
			<h2 class="card-title">
      	Match Filters
				<div class="badge badge-primary text-xs font-bold">NEW</div>
			</h2>

			<div class="options flex flex-col gap-4 mt-6">
				<div>
					<p class="text-white font-bold mb-1">Side</p>
					<div class="btn-group">
						<button :class="`btn btn-sm normal-case ${activeSide === Side.All ? 'btn-active' : 'bg-base-100'}`" @click="sideChange(Side.All)">All</button>
						<button :class="`btn btn-sm normal-case ${activeSide === Side.Attacking ? 'btn-active' : 'bg-base-100'}`" @click="sideChange(Side.Attacking)">Attack</button>
						<button :class="`btn btn-sm normal-case ${activeSide === Side.Defending ? 'btn-active' : 'bg-base-100'}`" @click="sideChange(Side.Defending)">Defense</button>
					</div>
				</div>
				<div>
					<p class="text-white font-bold mb-1">Round Outcome</p>
					<div class="btn-group">
						<button :class="`btn btn-sm normal-case ${activeOutcome === RoundOutcome.All ? 'btn-active' : 'bg-base-100'}`" @click="outcomeChange(RoundOutcome.All)">All</button>
						<button :class="`btn btn-sm normal-case ${activeOutcome === RoundOutcome.Win ? 'btn-active' : 'bg-base-100'}`" @click="outcomeChange(RoundOutcome.Win)">Win</button>
						<button :class="`btn btn-sm normal-case ${activeOutcome === RoundOutcome.Loss ? 'btn-active' : 'bg-base-100'}`" @click="outcomeChange(RoundOutcome.Loss)">Loss</button>
					</div>
				</div>

				<div>
					<p class="text-white font-bold mb-1">PlantSite</p>
					<div class="btn-group">
						<button :class="`btn btn-sm normal-case ${plantedSite === PlantSite.All ? 'btn-active' : 'bg-base-100'}`" @click="siteChange(PlantSite.All)">All</button>
						<button :class="`btn btn-sm normal-case ${plantedSite === PlantSite.A ? 'btn-active' : 'bg-base-100'}`" @click="siteChange(PlantSite.A)">A</button>
						<button :class="`btn btn-sm normal-case ${plantedSite === PlantSite.B ? 'btn-active' : 'bg-base-100'}`" @click="siteChange(PlantSite.B)">B</button>
						<button :class="`btn btn-sm normal-case ${plantedSite === PlantSite.C ? 'btn-active' : 'bg-base-100'}`" @click="siteChange(PlantSite.C)">C</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue';
import { useFilter } from '~~/store/filter';
import { RoundOutcome, Side } from '~~/types/filters';
import { PlantSite } from '~/types/match';

const filter = useFilter();
const activeSide: Ref<Side> = ref(Side.All);
const activeOutcome: Ref<RoundOutcome> = ref(RoundOutcome.All);
const plantedSite: Ref<PlantSite> = ref(PlantSite.All);


function sideChange(side: Side) {
	activeSide.value = side;
	filter.updateFilter('side', side);
}

function outcomeChange(outcome: RoundOutcome) {
	activeOutcome.value = outcome;
	filter.updateFilter('roundOutcome', outcome);
}

function siteChange(site: PlantSite) {
	plantedSite.value = site;
	filter.updateFilter('PlantSite', site);
}
</script>