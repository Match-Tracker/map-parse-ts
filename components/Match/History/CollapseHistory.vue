<template>
	<div class="collapse collapse-arrow bg-neutral rounded-box">
		<input v-model="isOpen" type="checkbox" /> 
		<div class="flex items-center gap-1 collapse-title text-xl font-medium pl-6 text-white">
			{{ props.account.username }}#{{ props.account.tagline }}
			<span class="text-xs text-gray-500">
				EUW
			</span>
		</div>
		<div class="matches flex flex-col gap-6 collapse-content px-6"> 
			<div class="match items-center flex" v-for="(match, index) in matches" :key="index">
				<div class="match__info flex items-start">
					<img class="w-32 h-14 mr-4 rounded-md object-cover" :src="mapImage(match.map)" />
					<div class="-mt-1">
						<h3 class="text-white font-bold text-lg">
							{{ match.map }}
						</h3>

						<p class="text-xs -mt-1">
							{{ match.mode }}
						</p>

						<p>
							<span class="text-blue-400">
								{{ match.score.blue }}
							</span>
							-
							<span class="text-red-500">
								{{ match.score.red }}
							</span>
						</p>
					</div>
				</div>

				<NuxtLink :class="`btn btn-sm ml-auto normal-case ${auth.user.subscription.active ? 'text-white btn-primary' : 'btn-disabled'}`" :to="`/match/${match.matchId}`">
					Analyze
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue';
import { useAuth } from '~~/store/auth';
import { APIMatch } from '~~/types/match';
import { RiotAccount } from '~~/types/user';

const auth = useAuth();

const isOpen: Ref<boolean> = ref(true);
const matches: Ref<APIMatch[]> = ref([]);

const filter: Ref<string> = ref('unrated');

const props = defineProps<{
	account: RiotAccount;
}>();

async function fetchMatches () {
	const { data } = await useFetch(`/api/matches?region=eu&puuid=${props.account.puuid}&filter=${filter.value}`, { method: 'GET' });

	if (data) {
		matches.value = data.value as APIMatch[];
	}
}

function mapImage (name: string) {
	const href = new URL(`/assets/img/maps/listview/${name}.png`, import.meta.url).href;
	return href
}

onMounted(async () => {
	await fetchMatches();
});
</script>