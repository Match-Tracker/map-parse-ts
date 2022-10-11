<template>
	<div class="card bg-neutral">
		<div class="card-body">
			<h2 class="card-title">
      	Match Filters
				<div class="badge badge-primary text-xs font-bold">NEW</div>
			</h2>

			<div class="options flex flex-col gap-4 mt-6">
				<div class="tabs tabs-boxed">
					<a :class="`tab ${isActive('movement') ? 'tab-active' : ''}`" @click="setActive('movement')">Movement</a> 
					<a :class="`tab ${isActive('kills') ? 'tab-active' : ''}`" @click="setActive('kills')">Kills</a> 
					<a :class="`tab ${isActive('plants') ? 'tab-active' : ''}`" @click="setActive('plants')">Plants</a>
				</div>

				<ButtonGroup v-for="(filterable, index) in filters" v-show="filterable.tabs.includes(activeTab)" :key="index" :title="filterable.title" :options="filterable.options" :key-name="filterable.key" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue';

import { useFilter } from '~~/store/filter';
import { RoundOutcome, Side, TradedFilter } from '~~/types/filters';
import { PlantSite } from '~/types/match';

import ButtonGroup from './ButtonGroup.vue';

const filter = useFilter();
const activeTab: Ref<string> = ref('movement');

function isActive (tab: string) {
	return activeTab.value === tab
}

function setActive (tab: string) {
	activeTab.value = tab;

	filter.changeTab(tab);
}
// Create a dynamic function that can take in a parameter of type T and updates the filter
const filters = [
	{
		title: 'Display As',
		key: 'drawHeatmap',
		tabs: ['movement'],
		options: [
			{
				label: 'Points',
				value: false
			},
			{
				label: 'Heatmap',
				value: true
			}
		]
	},
	{
		title: 'Side',
		key: 'side',
		tabs: ['movement', 'kills'],
		options: [
			{
				value: Side.All,
				label: 'All'
			},
			{
				value: Side.Attacking,
				label: 'Attack'
			},
			{
				value: Side.Defending,
				label: 'Defense'
			}
		]
	},
	{
		title: 'Round Outcome',
		key: 'roundOutcome',
		tabs: ['movement', 'kills', 'plants'],
		options: [
			{
				value: RoundOutcome.All,
				label: 'All'
			},
			{
				value: RoundOutcome.Win,
				label: 'Win'
			},
			{
				value: RoundOutcome.Loss,
				label: 'Loss'
			}
		]
	},
	{
		title: 'Planted At',
		key: 'plantedAt',
		tabs: ['plants'],
		options: [
			{
				value: PlantSite.All,
				label: 'All'
			},
			{
				value: PlantSite.A,
				label: 'A'
			},
			{
				value: PlantSite.B,
				label: 'B'
			},
			{
				value: PlantSite.C,
				label: 'C'
			}
		]
	},
	{
		title: 'Traded Kill',
		key: 'traded',
		tabs: ['kills'],
		options: [
			{
				label: 'All',
				value: TradedFilter.All
			},
			{
				label: 'Traded',
				value: TradedFilter.Traded,
			},
			{
				label: 'Untraded',
				value: TradedFilter.NotTraded
			}
		]
	},
	{
		title: 'Kill Time',
		key: 'firstBlood',
		tabs: ['kills'],
		options: [
			{
				label: 'All',
				value: false
			},
			{
				label: 'First Blood',
				value: true,
			}
		]
	}
]
</script>