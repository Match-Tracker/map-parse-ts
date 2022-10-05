<template>
	<ul class="menu bg-neutral w-56 rounded-box">
		<li v-for="(kill, index) in filteredKills" :key="index">
			<div class="items-center">
				<img class="w-6 h-6 rounded-full" />
				<p>{{ kill.killer_display_name }}</p>
				<div class="bg-blue-300 rounded-full w-2 h-2 justify-self-end" />
			</div>
		</li>
	</ul>
</template>

<script lang="ts" setup>
import useMatch from '@/store/match';

const match = useMatch();

const filteredKills = computed(() => {
	return match.kills.filter(kill => kill.round === 1)
})
</script>