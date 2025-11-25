<script setup lang="ts">
import type { Period } from "@allystudio/usetemporal";
import type { Ref } from "vue";
import { computed, unref } from "vue";
import { useTemporal, usePeriod } from "@allystudio/usetemporal-vue";

const props = defineProps<{
  period?: Period | Ref<Period>;
}>();

const temporal = useTemporal();
const month = usePeriod(temporal, "month");

const formatter = new Intl.DateTimeFormat(temporal.locale, { month: "long" });

const targetMonth = computed(() => {
  const provided = props.period;
  return provided ? unref(provided) : month.value;
});
</script>

<template>
  <span class="temporal-month-name">
    {{ formatter.format(targetMonth.start) }}
  </span>
</template>
