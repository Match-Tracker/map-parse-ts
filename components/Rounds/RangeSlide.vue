<template>
  <div>
    <Slider v-model="range" :min="0" :max="150" :step="5" @change="onChange" />
  </div>
</template>

<script lang="ts" setup>
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

import { type Ref } from 'vue';
import { useFilter } from '~~/store/filter';

const filter = useFilter();
const range: Ref<number[]> = ref([0, 150])

function onChange (value: number[]) {
  filter.updateFilter('roundTimeRange', value)
}
</script>