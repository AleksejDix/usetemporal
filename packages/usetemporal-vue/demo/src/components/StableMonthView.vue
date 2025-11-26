<script setup lang="ts">
import type { Period } from "@allystudio/usetemporal";
import { useTemporal } from "@allystudio/usetemporal-vue";
import WeekNamesView from "./WeekNamesView.vue";

const props = defineProps<{
  month: Period;
  selected: Period;
  today: Period;
  weekStartsOn: number;
  activeUnit: "week" | "month";
  weeks: Array<{ period: Period; days: Period[] }>;
}>();

const emit = defineEmits<{ (e: "select", day: Period): void }>();

const temporal = useTemporal();

const isToday = (day: Period) => temporal.contains(day, props.today.date);
const isSelectedDay = (day: Period) => temporal.contains(day, props.selected);
const isInsideSelection = (day: Period) =>
  temporal.contains(props.selected, day);
const isOutsideMonth = (day: Period) =>
  day.start.getMonth() !== props.month.start.getMonth();
const isActiveWeek = (week: Period) =>
  props.activeUnit === "week" && temporal.contains(props.selected, week);

function selectDay(day: Period) {
  emit("select", day);
}
</script>

<template>
  <section class="month-view">
    <WeekNamesView :week-starts-on="weekStartsOn" />
    <div
      v-for="week in weeks"
      :key="week.period.start.toISOString()"
      class="week-row"
      :class="{ active: isActiveWeek(week.period) }"
    >
      <button
        v-for="day in week.days"
        :key="day.start.toISOString()"
        class="day-cell"
        :class="{
          today: isToday(day),
          selected: isSelectedDay(day),
          outside: isOutsideMonth(day),
          focus: isInsideSelection(day),
        }"
        @click="selectDay(day)"
      >
        <span class="number">{{ day.start.getDate() }}</span>
        <span class="weekday">{{
          day.start.toLocaleDateString("en", { weekday: "short" })
        }}</span>
      </button>
    </div>
  </section>
</template>
