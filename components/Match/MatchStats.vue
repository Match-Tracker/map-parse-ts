<template>
  <div class="flex flex-col justify-center overflow-visible gap-4">
    <p class="text-lg font-bold text-center"> Match Stats </p>

    <div class="tabs tabs-boxed w-fit mx-auto">
			<a :class="`tab ${isActive('all') ? 'tab-active' : ''}`" @click="setActive('all')">All</a>
      <a :class="`tab ${isActive('attack') ? 'tab-active' : ''}`" @click="setActive('attack')">Attack</a>
      <a :class="`tab ${isActive('defence') ? 'tab-active' : ''}`" @click="setActive('defence')">Defence</a>
    </div>

    <div class="flex w-full">
      <div class="flex flex-col card bg-base-300 rounded-box w-1/2 justify-center items-center p-8 gap-2">
        <p> Team 1</p>
        <div class="stats shadow w-fit">
          <div class="stat">
            <div class="stat-title">Rounds with operator</div>
            <div class="stat-value">40%</div>
          </div>
        </div>
      </div>
      <div class="divider divider-horizontal"></div>
      <div class="flex flex-col card bg-base-300 rounded-box w-1/2 justify-center items-center p-8 gap-2">
        <p> Team 2</p>
        <div class="stats shadow w-fit">
          <div class="stat">
            <div class="stat-title">Rounds with operator</div>
            <div class="stat-value">60%</div>
          </div>
        </div>
      </div>    
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { useMatchStats } from '~~/store/match-stats';

const activeTab = ref('all');
// const stats = useMatchStats()

function isActive(tab: string) {
	return activeTab.value === tab
}

function setActive(tab: string) {
	activeTab.value = tab;
  // stats.updateFilter('side', tab)
}
</script>