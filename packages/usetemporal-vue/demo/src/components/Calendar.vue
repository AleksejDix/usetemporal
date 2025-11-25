<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { Period } from "@allystudio/usetemporal";
import { createTemporal, usePeriod } from "@allystudio/usetemporal-vue";
import { createNativeAdapter } from "@allystudio/usetemporal/native";
import StableMonthView from "./StableMonthView.vue";
import YearView from "./YearView.vue";
import WeekView from "./WeekView.vue";
import WorkweekView from "./WorkweekView.vue";
import DayView from "./DayView.vue";

interface CalendarProps {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  initialDate?: Date;
  initialUnit?: "week" | "month";
}

interface CalendarEmits {
  (e: "select", period: Period): void;
  (e: "navigate", period: Period): void;
}

const props = withDefaults(defineProps<CalendarProps>(), {
  weekStartsOn: 1,
  initialDate: () => new Date(),
  initialUnit: "month",
});

const emit = defineEmits<CalendarEmits>();

// Reactive state
const weekStartsOn = ref(props.weekStartsOn);
const unit = ref(props.initialUnit);
const browsingDate = ref(props.initialDate);

// Create temporal instance - this will automatically provide it to children via Vue's provide/inject
const temporal = createTemporal({
  adapter: createNativeAdapter({ weekStartsOn: weekStartsOn.value }),
  date: browsingDate,
});

// Watch for weekStartsOn changes and update the adapter
watch(weekStartsOn, (value) => {
  temporal.adapter = createNativeAdapter({ weekStartsOn: value });
  temporal.weekStartsOn = value;
  const current = browsing.value;
  browsing.value = temporal.period(current.date, current.type);
});

// Expose browsing for external control
const browsing = temporal.browsing;

// Period computations using the temporal composables
const activeUnit = computed(() => unit.value);
const baseActivePeriod = usePeriod(temporal, activeUnit);
const baseDayPeriod = usePeriod(temporal, "day");
const baseWeekPeriod = usePeriod(temporal, "week");
const baseMonthPeriod = usePeriod(temporal, "month");
const baseYearPeriod = usePeriod(temporal, "year");

// Computed periods
const activePeriod = computed(() => baseActivePeriod.value);
const dayPeriod = computed(() => baseDayPeriod.value);
const weekPeriod = computed(() => baseWeekPeriod.value);
const monthPeriod = computed(() => baseMonthPeriod.value);
const yearPeriod = computed(() => baseYearPeriod.value);

// Today reference
const todayPeriod = computed(() => temporal.now.value);

// Navigation helpers
const monthWeeks = computed(() => {
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

const detailDays = computed(() => {
  return temporal.divide(activePeriod.value, "day");
});

// Formatters
const formatter = reactive({
  header: new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }),
  detail: new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }),
  range: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }),
});

// Computed labels
const todayLabel = computed(() =>
  formatter.detail.format(todayPeriod.value.date)
);

const activeRangeLabel = computed(() => {
  return `${formatter.range.format(activePeriod.value.start)} – ${formatter.range.format(
    activePeriod.value.end
  )}`;
});

const unitLabel = computed(() => (unit.value === "week" ? "Week" : "Month"));

// Event handlers
function shift(step: number) {
  browsing.value = temporal.go(activePeriod.value, step);
  emit("navigate", browsing.value);
}

function resetToToday() {
  browsing.value = temporal.period(new Date(), "day");
  emit("navigate", browsing.value);
}

function selectDay(day: Period) {
  browsing.value = day;
  emit("select", day);
}

function selectMonth(month: Period) {
  browsing.value = month;
  unit.value = "month";
  emit("select", month);
}

// Expose methods for parent components
defineExpose({
  shift,
  resetToToday,
  selectDay,
  selectMonth,
  setUnit: (newUnit: "week" | "month") => {
    unit.value = newUnit;
  },
  setWeekStartsOn: (newWeekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    weekStartsOn.value = newWeekStartsOn;
  },
});
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
            <button
              :class="{ active: unit === 'month' }"
              @click="unit = 'month'"
            >
              Month
            </button>
            <button :class="{ active: unit === 'week' }" @click="unit = 'week'">
              Week
            </button>
          </div>
          <label class="weekstart">
            Week starts on
            <input
              v-model.number="weekStartsOn"
              type="number"
              min="0"
              max="6"
            />
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
          <YearView
            :year="yearPeriod"
            :month="monthPeriod"
            @select="selectMonth"
          />
          <WeekView
            :week="weekPeriod"
            :selected="browsing"
            @select="selectDay"
          />
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
              <article
                v-for="day in detailDays"
                :key="day.start.toISOString()"
                class="detail-card"
              >
                <span class="mini-label">
                  {{ day.start.toLocaleDateString("en", { weekday: "short" }) }}
                </span>
                <strong>
                  {{
                    day.start.toLocaleDateString("en", {
                      month: "long",
                      day: "numeric",
                    })
                  }}
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
