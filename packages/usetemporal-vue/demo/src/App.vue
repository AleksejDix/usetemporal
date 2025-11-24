<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { Period } from "@allystudio/usetemporal";
import { createTemporal, usePeriod } from "@allystudio/usetemporal-vue";
import { createNativeAdapter } from "@allystudio/usetemporal/native";
import StableMonthView from "./components/StableMonthView.vue";
import YearView from "./components/YearView.vue";
import WeekView from "./components/WeekView.vue";
import WorkweekView from "./components/WorkweekView.vue";
import DayView from "./components/DayView.vue";

const weekStartsOn = ref(1);
const weekStartSignal = ref(weekStartsOn.value);
const unit = ref<"week" | "month">("month");

const temporal = createTemporal({
  adapter: createNativeAdapter({ weekStartsOn: weekStartsOn.value }),
  date: new Date(),
});

watch(weekStartsOn, (value) => {
  temporal.adapter = createNativeAdapter({ weekStartsOn: value });
  temporal.weekStartsOn = value;
  weekStartSignal.value = value;
  const current = browsing.value;
  browsing.value = temporal.period(current.date, current.type);
});

const browsing = temporal.browsing;
const activeUnit = computed(() => unit.value);

const baseActivePeriod = usePeriod(temporal, activeUnit);
const baseDayPeriod = usePeriod(temporal, "day");
const baseWeekPeriod = usePeriod(temporal, "week");
const baseMonthPeriod = usePeriod(temporal, "month");
const baseYearPeriod = usePeriod(temporal, "year");

const activePeriod = computed(() => {
  weekStartSignal.value;
  return baseActivePeriod.value;
});
const dayPeriod = computed(() => {
  weekStartSignal.value;
  return baseDayPeriod.value;
});
const weekPeriod = computed(() => {
  weekStartSignal.value;
  return baseWeekPeriod.value;
});
const monthPeriod = computed(() => {
  weekStartSignal.value;
  return baseMonthPeriod.value;
});
const yearPeriod = computed(() => {
  weekStartSignal.value;
  return baseYearPeriod.value;
});

const todayPeriod = computed(() => temporal.now.value);

const detailDays = computed(() => {
  weekStartSignal.value;
  return temporal.divide(activePeriod.value, "day");
});

const monthWeeks = computed(() => {
  weekStartSignal.value;
  const month = monthPeriod.value;
  const firstWeek = temporal.period(month.start, "week");
  return Array.from({ length: 6 }, (_, index) => {
    const period = index === 0 ? firstWeek : temporal.go(firstWeek, index);
    return {
      period,
      days: temporal.divide(period, "day"),
    };
  });
});

const formatter = reactive({
  header: new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }),
  detail: new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }),
  range: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }),
});

const todayLabel = computed(() => formatter.detail.format(todayPeriod.value.date));
const activeRangeLabel = computed(() => {
  weekStartSignal.value;
  return `${formatter.range.format(activePeriod.value.start)} – ${formatter.range.format(
    activePeriod.value.end
  )}`;
});
const unitLabel = computed(() => (unit.value === "week" ? "Week" : "Month"));

function shift(step: number) {
  browsing.value = temporal.go(activePeriod.value, step);
}

function resetToToday() {
  browsing.value = temporal.period(new Date(), "day");
}

function selectDay(day: Period) {
  browsing.value = day;
}

function selectMonth(month: Period) {
  browsing.value = month;
  unit.value = "month";
}
</script>

<template>
  <div class="calendar-shell">
    <div class="calendar-app">
      <header class="calendar-header">
        <div class="header-meta">
          <p class="eyebrow">Today · {{ todayLabel }}</p>
          <h1>{{ formatter.header.format(monthPeriod.start) }}</h1>
        </div>
        <div class="primary-controls">
          <div class="nav-controls">
            <button class="nav-button" @click="shift(-1)">‹</button>
            <button class="nav-button" @click="resetToToday()">Today</button>
            <button class="nav-button" @click="shift(1)">›</button>
          </div>
          <div class="segment-control">
            <button :class="{ active: unit === 'month' }" @click="unit = 'month'">
              Month
            </button>
            <button :class="{ active: unit === 'week' }" @click="unit = 'week'">
              Week
            </button>
          </div>
          <label class="weekstart">
            Week starts on
            <input v-model.number="weekStartsOn" type="number" min="0" max="6" />
          </label>
        </div>
      </header>

      <main class="calendar-main">
        <StableMonthView
          :month="monthPeriod"
          :selected="activePeriod"
          :today="todayPeriod"
          :week-starts-on="weekStartsOn"
          :active-unit="unit"
          :weeks="monthWeeks"
          @select="selectDay"
        />

        <section class="panel-grid">
          <YearView :year="yearPeriod" :month="monthPeriod" @select="selectMonth" />
          <WeekView :week="weekPeriod" :selected="browsing" @select="selectDay" />
          <WorkweekView :week="weekPeriod" />
          <DayView :day="dayPeriod" />
          <section class="panel-card detail-panel">
            <div class="detail-header">
              <p class="eyebrow">{{ unitLabel }} overview</p>
              <h2>{{ activeRangeLabel }}</h2>
            </div>
            <p class="detail-note">
              Derived from <code>usePeriod(temporal, unit)</code> with
              <code>temporal.divide(period, "day")</code>.
            </p>
            <div class="detail-days">
              <article v-for="day in detailDays" :key="day.start.toISOString()" class="detail-card">
                <span class="mini-label">
                  {{ day.start.toLocaleDateString("en", { weekday: "short" }) }}
                </span>
                <strong>
                  {{ day.start.toLocaleDateString("en", { month: "long", day: "numeric" }) }}
                </strong>
                <small>Unit: {{ day.type }}</small>
              </article>
            </div>
          </section>
        </section>
      </main>
    </div>
  </div>
</template>
