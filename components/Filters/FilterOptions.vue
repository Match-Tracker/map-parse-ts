<template>
	<div class="card bg-neutral">
		<div class="card-body">
			<h2 class="card-title">
      	Match Filters
				<div class="badge badge-primary text-xs font-bold">NEW</div>
			</h2>

			<div class="options flex flex-col gap-4 mt-6">

				<div>
					<p class="text-white font-bold mb-1">Side</p>
					<div class="btn-group">
						<button :class="`btn btn-sm normal-case ${activeSide === Side.All ? 'btn-active' : 'bg-base-100'}`" @click="sideChange(Side.All)">All</button>
						<button :class="`btn btn-sm normal-case ${activeSide === Side.Attacking ? 'btn-active' : 'bg-base-100'}`" @click="sideChange(Side.Attacking)">Attack</button>
						<button :class="`btn btn-sm normal-case ${activeSide === Side.Defending ? 'btn-active' : 'bg-base-100'}`" @click="sideChange(Side.Defending)">Defense</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue';
import { Side } from '~~/types/filters';

const activeSide: Ref<Side> = ref(Side.All);

const emit = defineEmits<{(e: 'update', id: Side): Side}>()

function sideChange(side: Side) {
	activeSide.value = side;
	emit('update', side);
}



</script>