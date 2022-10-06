<template>
	<div class="bg-neutral rounded-box h-8 w-96">
		<div class="flex justify-center h-full">
			<div class="bg-blue-500 text-right pl-8 pr-2 text-white text-2xl font-bold rounded-l-lg leading-8">
				{{ match.teams.blue.rounds_won }}
			</div>
			<div class="bg-red-500 text-left pr-8 text-white text-2xl font-bold pl-2 rounded-r-lg leading-8">
				{{ match.teams.red.rounds_won }}
			</div>
		</div>
	</div>
</template>


<script lang="ts" setup>
import useMatch from '~~/store/match';

const match = useMatch();
</script>