<template>
	<div class="min-w-fit flex flex-col mx-4 sm:flex-row sm:mt-28 justify-center gap-12">
		<div class="card bg-neutral" v-for="(plan, index) in packages" :key="index">
			<div class="card-body">
				<div class="card-title text-left">
					{{ plan.name }}
				</div>
				
				<div class="price flex items-center gap-2">
					<div class="text-4xl font-bold text-white">
						${{ plan.price }}
					</div>

					<div class="text-sm font-bold">
						/ month
					</div>
				</div>

				<div class="card-subtitle text-left w-60 text-sm my-3">
					{{ plan.description }}
				</div>

				<ul>
					<li class="my-4" v-for="(feature, index) in plan.features" :key="index">
						<client-only>
							<f-icon class="mr-1 text-green-400" :icon="['fas', 'badge-check']" />
						</client-only>
						{{ feature }}
					</li>
				</ul>

				<button class="btn btn-primary normal-case text-white max-w-fit mx-auto mt-auto min-h-0 h-10">
					<client-only>
						<f-icon class="mr-2" :icon="['fas', 'credit-card']" />
					</client-only>
					Purchase
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>

const packages = [
	{
		'name': 'Player',
		'price': 9.99,
		'description': 'For players who want to track & analyse their positioning, economy, plants and more.',
		'features': [
			'Access to Analysis Tool',
			'Access to Match History',
			'Ability to share Match snapshots',
		]
	},
	{
		'name': 'Team',
		'price': '24.99',
		'description': 'For teams who want to track their players games,.',
		'features': [
			'Access to Analysis Tool',
			'Access to Match History',
			'Ability to share Match snapshots',
			'Access for up to 5 members',
		]
	}
]
</script>