<script setup lang="ts">
import type { Unit } from "@allystudio/usetemporal";
import { computed, ref } from "vue";
import { useTemporal, usePeriod } from "@allystudio/usetemporal-vue";

const props = withDefaults(
  defineProps<{
    initialUnit?: Unit;
  }>(),
  {
    initialUnit: "month",
  }
);

const slots = defineSlots<{
  default?: (scope: {
    unit: typeof viewUnit;
    viewPeriod: ReturnType<typeof usePeriod>;
    setUnit: (next: Unit) => void;
  }) => any;
}>();

const temporal = useTemporal();
const viewUnit = ref<Unit>(props.initialUnit);
const unitComputed = computed(() => viewUnit.value);
const viewPeriod = usePeriod(temporal, unitComputed);

function setUnit(next: Unit) {
  viewUnit.value = next;
}
</script>

<template>
  <slot v-if="viewPeriod" :unit="viewUnit" :view-period="viewPeriod" :set-unit="setUnit" />
</template>
