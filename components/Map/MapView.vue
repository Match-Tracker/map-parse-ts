<template>
	<canvas ref="mapRef" />
</template>

<script lang="ts" setup>
import useMatch from '@/store/match';
import { ref, onMounted, type Ref } from 'vue'

const match = useMatch();
const mapRef: Ref<HTMLCanvasElement | null> = ref(null)

onMounted(async () => {
	if (mapRef.value && match.metadata.map) {
		match.createCanvas(mapRef.value);
	}
})
</script>