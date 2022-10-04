<template>
  <Suspense>
    <Map v-if="match.metadata.matchid" />
  </Suspense>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

import Map from '@/components/Map/index.vue'
import useMatch from './stores/match'

const matchId = 'e941f972-8067-411d-83c1-abbfdcdae412'

const match = useMatch();

onMounted(async () => {
  await match.fetchMatch(matchId); 
})
</script>