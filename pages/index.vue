<template>
	<div class="px-80 mt-24">
		<div class="flex gap-16">
			<div>
				<h3 class="text-6xl text-white font-black">
					Visualize your Matches
					<span class="badge badge-secondary text-white py-3 text-sm absolute mt-6 ml-2">Beta</span>
				</h3>
				<p class="mt-1 text-md">
					Analyze your matches and get noticable insights about you and your teams gameplay.
				</p>

				<NuxtLink class="btn btn-primary btn-md mt-6 normal-case text-md" to="/upgrade">
					<ClientOnly>
						<f-icon :icon="['fas', 'credit-card']" class="mr-2" />
					</ClientOnly>
					Pricing
				</NuxtLink>

				<a class="btn btn-primary btn-md btn-outline mt-6 normal-case text-md ml-4" :href="config.public.OAUTH_URL">
					<ClientOnly>
						<f-icon :icon="['fab', 'discord']" class="mr-2" />
					</ClientOnly>
					Sign In
				</a>
			</div>

			<div class="mockup-window bg-neutral max-w-2xl shadow-lg">
				<img src="/img/mockups/1.png" class="w-full object-fill" />
			</div>
		</div>

	</div>
</template>

<script setup>
const config = useRuntimeConfig();

</script>