<script setup lang="ts">
import type { Period } from "@allystudio/usetemporal";
import { computed, ref } from "vue";
import { createTemporal, usePeriod } from "@allystudio/usetemporal-vue";
import { createNativeAdapter } from "@allystudio/usetemporal/native";
import WeekNamesView from "./WeekNamesView.vue";

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const initialDate = ref(new Date());
const temporal = createTemporal({
  adapter: createNativeAdapter({ weekStartsOn: 1 }),
  date: initialDate,
});

const month = usePeriod(temporal, "month");

const weekdayLabels = computed(() => {
  const start = temporal.weekStartsOn % 7;
  return Array.from({ length: 7 }, (_, idx) => WEEKDAY_NAMES[(idx + start) % 7]);
});

const daysInMonth = computed(() => temporal.divide(month.value, "day"));
const firstDayOffset = computed(() => {
  const first = daysInMonth.value[0];
  return first ? getOffset(first.start) + 1 : 1;
});

const selectedDay = ref<Period | null>(null);

function selectDay(day: Period) {
  selectedDay.value = day;
}

function jump(period: Period, count: number) {
  temporal.go(period, count);
}

function getOffset(date: Date) {
  const systemIndex = date.getDay(); // Sunday = 0
  const start = temporal.weekStartsOn ?? 0;
  return (systemIndex - start + 7) % 7;
}
</script>

<template>
  <CalendarViewState v-slot="{ unit, viewPeriod, setUnit }">
    <section class="vue-temporal-demo">
      
      <div class="view-switch">
    <button
      :class="{ active: unit === 'week' }"
      @click="setUnit('week')"
      >
      Week
    </button>
      <button
      :class="{ active: unit === 'month' }"
      @click="setUnit('month')"
      >
      Month
    </button>
    <button
    :class="{ active: unit === 'year' }"
    @click="setUnit('year')"
    >
    Year
  </button>
</div>

<CalendarHeader :unit="unit" />
      <WeekNamesView class="weeknames" />

      <div class="calendar-grid">
      <div
        v-for="label in weekdayLabels"
        :key="label"
        class="weekday-label"
      >
        {{ label }}
      </div>
      <button
        v-for="(day, index) in daysInMonth"
        :key="day.start.toISOString()"
        class="day-cell"
        :data-column-start="index === 0 ? firstDayOffset : undefined"
        :class="{
          'is-other-month': !temporal.contains(month, day.date),
          'is-selected':
            selectedDay?.start.getTime() === day.start.getTime(),
          'is-today': temporal.isSame(day, temporal.now.value, 'day'),
        }"
        @click="selectDay(day)"
      >
        <span>{{ day.date.getDate() }}</span>
      </button>
      </div>

      <footer class="demo-footer">
        <div>
          <p class="eyebrow">Selected day</p>
          <p v-if="selectedDay">
            {{ selectedDay.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) }}
          </p>
          <p v-else>Tap a date to see details</p>
        </div>
        <div class="demo-actions">
          <button @click="jump(viewPeriod, -1)">Jump -1 {{ unit }}</button>
          <button @click="jump(viewPeriod, 1)">Jump +1 {{ unit }}</button>
        </div>
      </footer>
    </section>
  </CalendarViewState>
</template>
