<template>
	<div class="flex flex-col justify-center px-96 py-12">
		<CollapseHistory v-for="(account, index) in auth.user.riotAccounts" :key="index" :account="account" />
	</div>
</template>

<script lang="ts" setup>
import { useAuth } from '~~/store/auth';
import CollapseHistory from '~~/components/Match/History/CollapseHistory.vue';

const auth = useAuth();
console.log(auth.user.riotAccounts)
definePageMeta({
	title: 'Your Matches',
	description: 'Match History',
	meta: [
		{
			name: 'robots',
			content: 'noindex',
		},
	],
	middleware: ['auth-check']
});

</script>