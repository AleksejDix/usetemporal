<script setup lang="ts">
import { computed } from "vue";
import type { Period } from "@allystudio/usetemporal";
import { useTemporal } from "@allystudio/usetemporal-vue";

const props = defineProps<{
  week: Period;
}>();

const temporal = useTemporal();
const workingDays = computed(() =>
  temporal.divide(props.week, "day").filter((day) => {
    const dow = day.start.getDay();
    return dow >= 1 && dow <= 5;
  })
);
</script>

<template>
  <section class="panel-card workweek-view">
    <header>
      <p class="eyebrow">Workweek snapshot</p>
      <h3>Mon – Fri</h3>
    </header>
    <div class="workweek-list">
      <article v-for="day in workingDays" :key="day.start.toISOString()">
        <strong>{{ day.start.toLocaleDateString("en", { weekday: "long" }) }}</strong>
        <small>{{ day.start.toLocaleDateString("en", { month: "short", day: "numeric" }) }}</small>
      </article>
    </div>
  </section>
</template>
