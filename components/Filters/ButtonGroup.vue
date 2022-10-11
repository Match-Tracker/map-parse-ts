<template>
	<div>
		<p class="text-white font-bold mb-1">{{ title }}</p>
		<div class="btn-group">
			<button v-for="(option, index) in options" :key="index" :class="`btn btn-sm normal-case ${isActive(option.value) ? 'btn-active' : 'bg-base-100'}`" @click="createFilterUpdater(option.value)">
				{{ option.label }}
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useFilter } from '~~/store/filter';

const filter = useFilter();
const isActive = (value) => {
	return filter[props.keyName] === value || JSON.stringify(filter[props.keyName]) === JSON.stringify(value);
}

function createFilterUpdater<T>(value: T) {
	filter.updateFilter(props.keyName, value);
}

const props = defineProps<{
	title: string;
	keyName: string;
	options: {
		value: unknown;
		label: string;
	}[];
}>();
</script>