<template>
	<canvas ref="mapRef" />
</template>

<script lang="ts" setup>
import Map from '@/composables/map';
import useMatch from '@/stores/match';
import { ref, onMounted, type Ref } from 'vue'

const match = useMatch();
const mapRef: Ref<HTMLCanvasElement | null> = ref(null)
const map: Ref<Map | null> = ref(null);

onMounted(async () => {
	if (mapRef.value && match.metadata.map) {
		map.value = new Map(match, mapRef.value);
	}
})
</script>