<template>
	<div>
		<p class="text-white font-bold mb-1">{{ title }}</p>
		<div class="bg-base-100 rounded-lg min-w-full">
			<v-select v-model="selected" multiple :options="options" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import 'vue-select/dist/vue-select.css';
import vSelect from 'vue-select';
import { useFilter } from '~~/store/filter';
import { Ref } from 'vue';

const filter = useFilter();
const selected: Ref<{ label: string; value: any }[]> = ref([]);

function updateFilter<T>(values: T[]) {
	console.log(values)
	filter.updateFilter(props.keyName, values);
}

watch(selected, () => updateFilter(selected.value.map((option) => option.value)));

const props = defineProps<{
	title: string;
	keyName: string;
	options: {
		value: unknown;
		label: string;
	}[];
}>();
</script>

<style scoped>
:deep() {
  --vs-controls-color: #fc4949;
  --vs-border-color: #1F202B;

	--vs-actions-padding: 12px 6px 0 3px;
	
  --vs-dropdown-bg: #151822;
  --vs-dropdown-color: #eeeeee;
  --vs-dropdown-option-color: #eeeeee;

	--vs-controls-size: 0.8;

  --vs-selected-bg: #fc4949;
  --vs-selected-color: #eeeeee;

	--vs-search-input-bg: #2f4fbb;
  --vs-search-input-color: #eeeeee;

	--vs-controls-color: #eeeeee;

  --vs-dropdown-option--active-bg: #fc4949;
  --vs-dropdown-option--active-color: #eeeeee;
}
</style>