<script setup lang="ts">
import { computed } from "vue";
import { useTemporal, usePeriod } from "@allystudio/usetemporal-vue";

const temporal = useTemporal();
const weekPeriod = usePeriod(temporal, "week");
const weekdays = computed(() => temporal.divide(weekPeriod.value, "day"));

const formatter = new Intl.DateTimeFormat(temporal.locale, { weekday: "short" });

</script>

<template>
  <div class="week-names-view">
    <span v-for="weekday in weekdays" :key="weekday.toString()">
      {{ formatter.format(weekday.start) }}
    </span>
  </div>
</template>
