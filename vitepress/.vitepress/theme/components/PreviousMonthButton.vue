<script setup lang="ts">
import type { Unit } from "@allystudio/usetemporal";
import { computed } from "vue";
import { useTemporal, usePeriod } from "@allystudio/usetemporal-vue";

const props = defineProps<{
    unit: Unit;
  }>()

const temporal = useTemporal();
const targetPeriod = usePeriod(temporal, computed(() => props.unit));


</script>

<template>
  <button class="temporal-nav-button" @click="temporal.previous(targetPeriod)">
    <slot>Prev</slot>
  </button>
</template>
