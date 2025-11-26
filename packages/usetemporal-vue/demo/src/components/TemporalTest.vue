<script setup lang="ts">
import { computed } from "vue";
import { useTemporal } from "@allystudio/usetemporal-vue";

const temporal = useTemporal();
const today = computed(() => temporal.now.value);
const currentMonth = computed(() => temporal.period(today.value.date, "month"));
const monthDays = computed(() => temporal.divide(currentMonth.value, "day"));
</script>

<template>
  <div class="temporal-test">
    <h3>Temporal Test Component</h3>
    <p>Today: {{ today.date.toLocaleDateString() }}</p>
    <p>
      Current Month:
      {{
        currentMonth.start.toLocaleDateString("en", {
          month: "long",
          year: "numeric",
        })
      }}
    </p>
    <p>Days in month: {{ monthDays.length }}</p>
    <p>This component gets temporal context from the Calendar component!</p>
  </div>
</template>
