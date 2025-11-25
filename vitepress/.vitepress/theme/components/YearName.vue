<script setup lang="ts">
import type { Unit } from "@allystudio/usetemporal";
import { computed } from "vue";
import { useTemporal, usePeriod } from "@allystudio/usetemporal-vue";

const props = withDefaults(
  defineProps<{
    unit?: Unit;
  }>(),
  {
    unit: "year",
  }
);

const temporal = useTemporal();
const unitRef = computed(() => props.unit);
const targetPeriod = usePeriod(temporal, unitRef);
const formatter = computed(
  () => new Intl.DateTimeFormat(temporal.locale ?? "en", { year: "numeric" })
);
</script>

<template>
  <span class="temporal-year-name">
    {{ formatter.format(targetPeriod.date) }}
  </span>
</template>
