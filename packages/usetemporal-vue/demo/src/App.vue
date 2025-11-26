<script setup lang="ts">
import type { Period } from "@allystudio/usetemporal";
import { computed, ref } from "vue";
import Calendar from "./components/Calendar.vue";

const lastSelection = ref<Period | null>(null);
const lastNavigation = ref<Period | null>(null);

function handleSelect(period: Period) {
  lastSelection.value = period;
}

function handleNavigate(period: Period) {
  lastNavigation.value = period;
}

const formatPeriod = (period: Period | null) => {
  if (!period) {
    return "None";
  }

  return `${period.start.toLocaleDateString()} – ${period.end.toLocaleDateString()}`;
};

const lastSelectionLabel = computed(() => formatPeriod(lastSelection.value));
const lastNavigationLabel = computed(() => formatPeriod(lastNavigation.value));
</script>

<template>
  <Calendar
    :week-starts-on="1"
    :initial-date="new Date()"
    :initial-unit="'month'"
    @select="handleSelect"
    @navigate="handleNavigate"
  />
  <section class="calendar-status">
    <p>
      <strong>Last selection:</strong>
      <span>{{ lastSelectionLabel }}</span>
    </p>
    <p>
      <strong>Last navigation:</strong>
      <span>{{ lastNavigationLabel }}</span>
    </p>
  </section>
</template>
