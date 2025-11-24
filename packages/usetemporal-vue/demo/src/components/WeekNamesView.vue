<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ weekStartsOn: number }>();

const labels = computed(() => {
  const base = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const start = ((props.weekStartsOn % 7) + 7) % 7;
  return Array.from({ length: 7 }, (_, idx) => base[(start + idx) % 7]);
});
</script>

<template>
  <div class="weekday-row">
    <span v-for="label in labels" :key="label">{{ label }}</span>
  </div>
</template>
