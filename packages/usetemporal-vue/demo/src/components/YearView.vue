<script setup lang="ts">
import { computed } from "vue";
import type { Period } from "@allystudio/usetemporal";
import { useTemporal } from "@allystudio/usetemporal-vue";

const props = defineProps<{
  year: Period;
  month: Period;
}>();

const emit = defineEmits<{ (e: "select", period: Period): void }>();

const temporal = useTemporal();
const yearPeriod = computed(() => props.year);
const activeMonth = computed(() => props.month);

const months = computed(() => temporal.divide(yearPeriod.value, "month"));

const isActive = (month: Period) => temporal.contains(month, activeMonth.value);

function select(month: Period) {
  emit("select", month);
}
</script>

<template>
  <section class="panel-card year-view">
    <header>
      <p class="eyebrow">Year overview</p>
      <h3>{{ yearPeriod.start.getFullYear() }}</h3>
    </header>
    <div class="year-grid">
      <button
        v-for="monthPeriod in months"
        :key="monthPeriod.start.toISOString()"
        class="month-chip"
        :class="{ active: isActive(monthPeriod) }"
        @click="select(monthPeriod)"
      >
        <span class="title">{{
          monthPeriod.start.toLocaleDateString("en", { month: "short" })
        }}</span>
        <small>{{ temporal.divide(monthPeriod, "week").length }} weeks</small>
      </button>
    </div>
  </section>
</template>
