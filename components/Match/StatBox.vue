<template>
  <div class="stats shadow w-fit">
    <div class="stat">
      <div class="stat-title">{{ title }}</div>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-desc">{{ desc }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: String,
  value: String,
  desc: String
})
</script>