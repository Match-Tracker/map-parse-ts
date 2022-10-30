<template>
	<div class="max-w-3xl flex flex-col sm:mt-20 justify-center mx-auto gap-12">
		<div class="flex flex-col sm:flex-row justify-center mx-auto gap-12">
			<div class="card w-full bg-neutral ml-auto" v-for="(plan, index) in packages" :key="index">
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
	
					<div class="card-subtitle text-left w-full text-sm my-3">
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
		<div class="card w-full bg-neutral flex-grow">
			<div class="card-body flex-row p-4 items-center">
				<div class="card-title text-left">
					Free Team Trial <span class="text-sm text-white">( 7 days )</span>
				</div>
				<button class="btn btn-primary normal-case text-white max-w-fit ml-auto min-h-0 h-10">
						<client-only>
							<f-icon class="mr-2" :icon="['fas', 'credit-card']" />
						</client-only>
						Try Now
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
			'Access to Interactive match analysis',
			'Access to personal Match History',
			'Ability to share Match snapshots',
		]
	},
	{
		'name': 'Team',
		'price': '24.99',
		'description': 'For teams who want to track their players games,.',
		'features': [
			'Access to Interactive match analysis',
			'Access to personal Match History',
			'Ability to share Match snapshots',
			'Access for up to 5 members',
		]
	}
]
</script>