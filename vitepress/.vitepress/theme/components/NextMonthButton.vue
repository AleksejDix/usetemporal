<script setup lang="ts">
import type { Unit } from "@allystudio/usetemporal";
import { computed } from "vue";
import { useTemporal, usePeriod } from "@allystudio/usetemporal-vue";

const props = withDefaults(
  defineProps<{
    unit?: Unit;
  }>(),
  {
    unit: "month",
  }
);

const temporal = useTemporal();
const unitRef = computed(() => props.unit);
const targetPeriod = usePeriod(temporal, unitRef);

function goNext() {
  temporal.next(targetPeriod.value);
}
</script>

<template>
  <button class="temporal-nav-button" @click="goNext">
    <slot>Next</slot>
  </button>
</template>
