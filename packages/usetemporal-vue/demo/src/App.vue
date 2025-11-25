<script setup lang="ts">
import type { Period } from "@allystudio/usetemporal";
import Calendar from "./components/Calendar.vue";

function handleSelect(period: Period) {
  console.log("Selected period:", period);
}

function handleNavigate(period: Period) {
  console.log("Navigated to:", period);
}
</script>

<template>
  <Calendar
    :week-starts-on="1"
    :initial-date="new Date()"
    :initial-unit="'month'"
    @select="handleSelect"
    @navigate="handleNavigate"
  />
</template>
