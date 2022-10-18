<template>
  <div class="flex flex-col justify-center overflow-visible gap-4">
    <p class="text-2xl font-bold text-center"> Match Stats </p>

    <div class="tabs tabs-boxed w-fit mx-auto">
			<a :class="`tab ${isActive('All') ? 'tab-active' : ''}`" @click="setActive('All')">All</a>
      <a :class="`tab ${isActive('Attack') ? 'tab-active' : ''}`" @click="setActive('Attack')">Attack</a>
      <a :class="`tab ${isActive('Defence') ? 'tab-active' : ''}`" @click="setActive('Defence')">Defence</a>
    </div>

    <div class="flex w-full">
      <div class="flex flex-col card bg-base-300 rounded-box w-1/2 justify-start items-center p-8 gap-2 border-blue-500 border-2">
        <p class="font-bold text-xl"> Team 1 </p>
        <div class="flex flex-row gap-2 flex-wrap"> <StatBox v-for="(stat) in stats.stats" :title="stat['title']" :value="stat['Blue']" /> </div>
      </div>
      <div class="divider divider-horizontal"></div>
      <div class="flex flex-col card bg-base-300 rounded-box w-1/2 justify-start items-center p-8 gap-2 h-80 border-red-500 border-2">
        <p class="font-bold text-xl"> Team 2 </p>
        <div class="flex flex-row gap-2 flex-wrap"> <StatBox v-for="(stat) in stats.stats" :title="stat['title']" :value="stat['Red']" /> </div>
      </div>    
    </div>
  </div>
</template>

<script lang="ts" setup>
import StatBox from './StatBox.vue';
import MatchStats, { Side } from '~~/composables/match-stats'

const activeTab = ref('all');
const stats = new MatchStats
setActive('All')


function isActive(tab: string) {
	return activeTab.value === tab
}

function setActive(tab: string) {
	activeTab.value = tab;
  stats.newSide(Side[tab])

}
</script>