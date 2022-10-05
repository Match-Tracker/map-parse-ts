<template>
	
	<div class="w-full mt-56 flex flex-col justify-center items-center">
		<h1 class="text-xl text-white font-bold mb-6">
			Search via Match ID
		</h1>
		<input v-model="matchId" type="text" placeholder="e941f972-8067-411d-83c1-abbfdcdae412" class="input input-bordered input-md w-full max-w-lg rounded-full" />
		
		<client-only>
			<button class="btn btn-primary rounded-full px-6 mt-4 normal-case" @click="goToMatch">
				<f-icon :icon="['fas', 'search']" class="text-white text-lg font-bold mr-2" />
				Search
			</button>
		</client-only>
	</div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue';

const matchId: Ref<string> = ref('')

function goToMatch() {
	useRouter().push(`/match/${matchId.value}`)
}
</script>