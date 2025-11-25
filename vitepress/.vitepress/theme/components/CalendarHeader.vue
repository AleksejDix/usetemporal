<script setup lang="ts">
import type { Unit } from "@allystudio/usetemporal";
import type { Ref } from "vue";
import { computed, unref } from "vue";

const props = defineProps<{
  unit?: Unit | Ref<Unit>;
}>();

const unitValue = computed<Unit>(() => {
  const value = props.unit;
  return value ? unref(value) : "month";
});

const unitComponent = computed(() => {
  switch (unitValue.value) {
    case "year":
      return "YearName";
    case "week":
    case "day":
      return "WeekName";
    default:
      return "MonthName";
  }
});
</script>

<template>
  <header class="temporal-calendar-header">
    <div class="temporal-header-title">
      <component :is="unitComponent" :unit="unitValue" />
    </div>
    <div class="navigation">
      <PreviousMonthButton :unit="unitValue" />
      <TodayButton />
      <NextMonthButton :unit="unitValue" />
    </div>
  </header>
</template>
