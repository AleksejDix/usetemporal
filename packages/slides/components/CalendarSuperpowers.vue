<script setup lang="ts">
import { computed, ref } from "vue";

type Highlight = {
  label: string;
  start: string;
  end: string;
  tone: "primary" | "warning";
};

const timezone = ref<
  | "Europe/Zurich"
  | "America/New_York"
  | "Asia/Singapore"
  | "Pacific/Kiritimati"
  | "Pacific/Niue"
>("Europe/Zurich");
const weekStartsOn = ref<0 | 1>(1);
const viewDate = ref(new Date("2025-03-13T10:00:00Z"));

const highlights: Highlight[] = [
  {
    label: "Launch sprint",
    start: "2025-03-10",
    end: "2025-03-14",
    tone: "primary",
  },
  {
    label: "Blackout (maintenance)",
    start: "2025-03-23",
    end: "2025-03-24",
    tone: "warning",
  },
];

const stableGrid = computed(() =>
  createStableGrid(viewDate.value, weekStartsOn.value)
);

const weekdayLabels = computed(() => {
  const baseSunday = new Date(Date.UTC(2024, 9, 27));
  return Array.from({ length: 7 }, (_, index) => {
    const dayOffset = (weekStartsOn.value + index) % 7;
    const date = addDays(baseSunday, dayOffset);
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      timeZone: timezone.value,
    }).format(date);
  });
});

const calendarWeeks = computed(() => {
  const days = stableGrid.value.days.map((day) => enrichDay(day));
  const weeks: ReturnType<typeof enrichDay>[][] = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
});

const monthLabel = computed(() =>
  new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: timezone.value,
  }).format(viewDate.value)
);

const featureStats = computed(() => {
  const days = calendarWeeks.value.flat();
  const outsideDays = days.filter((day) => !day.inMonth).length;
  const reservedDays = days.filter((day) =>
    day.tags.includes("reserved")
  ).length;
  return {
    outsideDays,
    reservedDays,
    timezone: timezone.value.replace("_", " "),
    gridRows: calendarWeeks.value.length,
  };
});

function formatDayNumber(date: Date, tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    timeZone: tz,
  }).format(date);
}

function formatWeekday(date: Date, tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    timeZone: tz,
  }).format(date);
}

function enrichDay(day: Date) {
  const iso = day.toISOString().slice(0, 10);
  const inMonth = day.getMonth() === viewDate.value.getMonth();
  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
  const tags: Array<"reserved" | "blackout"> = [];

  highlights.forEach((highlight) => {
    if (isWithinRange(day, highlight.start, highlight.end)) {
      tags.push(highlight.tone === "primary" ? "reserved" : "blackout");
    }
  });

  // Check if this is today
  const today = new Date();
  const isToday =
    day.getDate() === today.getDate() &&
    day.getMonth() === today.getMonth() &&
    day.getFullYear() === today.getFullYear();

  return {
    iso,
    date: day,
    inMonth,
    isWeekend,
    isToday,
    tags,
    label: formatDayNumber(day, timezone.value),
    weekday: formatWeekday(day, timezone.value),
  };
}

function createStableGrid(date: Date, weekStartsOn: 0 | 1) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = monthStart.getDay();
  const diff = (dayOfWeek - weekStartsOn + 7) % 7;
  const gridStart = addDays(monthStart, -diff);
  const days: Date[] = [];

  for (let i = 0; i < 42; i++) {
    days.push(addDays(gridStart, i));
  }

  return { start: gridStart, days };
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function isWithinRange(date: Date, start: string, end: string) {
  const cursor = dateToISO(date);
  return cursor >= start && cursor <= end;
}

function dateToISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shiftMonth(amount: number) {
  const next = new Date(viewDate.value);
  next.setMonth(next.getMonth() + amount);
  viewDate.value = next;
}
</script>

<template>
  <section class="calendar-superpowers">
    <header class="calendar-superpowers__header">
      <div>
        <p class="eyebrow">Stable month · {{ featureStats.gridRows }} rows</p>
        <h3>{{ monthLabel }}</h3>
      </div>
      <div class="calendar-superpowers__controls">
        <div class="nav-group">
          <button type="button" class="nav-btn" @click="shiftMonth(-1)">
            ← Prev
          </button>
          <button type="button" class="nav-btn" @click="shiftMonth(1)">
            Next →
          </button>
        </div>
        <label class="control">
          <span>Week starts on</span>
          <div class="toggle-group">
            <button
              type="button"
              class="toggle"
              :class="{ 'is-active': weekStartsOn === 1 }"
              @click="weekStartsOn = 1"
            >
              Monday
            </button>
            <button
              type="button"
              class="toggle"
              :class="{ 'is-active': weekStartsOn === 0 }"
              @click="weekStartsOn = 0"
            >
              Sunday
            </button>
          </div>
        </label>
        <label class="control">
          <span>Timezone</span>
          <select v-model="timezone">
            <option value="Europe/Zurich">Europe/Zurich</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Asia/Singapore">Asia/Singapore</option>
            <option value="Pacific/Kiritimati">
              Pacific/Kiritimati (first)
            </option>
            <option value="Pacific/Niue">Pacific/Niue (last)</option>
          </select>
        </label>
      </div>
    </header>

    <div class="calendar-superpowers__body">
      <div class="calendar-grid">
        <div class="weekday-row">
          <span
            v-for="(weekday, idx) in weekdayLabels"
            :key="`${weekday}-${idx}`"
          >
            {{ weekday }}
          </span>
        </div>
        <div
          v-for="(week, index) in calendarWeeks"
          :key="`week-${index}`"
          class="week-row"
        >
          <button
            v-for="day in week"
            :key="day.iso"
            type="button"
            class="day-cell"
            :class="{
              'is-muted': !day.inMonth,
              'is-today': day.isToday,
            }"
          >
            <span class="day-number">{{ day.label }}</span>
            <span class="day-weekday">{{ day.weekday }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calendar-superpowers {
  border: 2px solid #000;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 860px;
  margin: 0 auto;
}

.calendar-superpowers__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 2px solid #000;
  padding-bottom: 0.75rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.6rem;
  color: #666;
  margin: 0;
  font-weight: 600;
}

.calendar-superpowers__controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.nav-group {
  display: inline-flex;
  gap: 0.35rem;
}

.nav-btn {
  border: 2px solid #000;
  background: #fff;
  color: #000;
  border-radius: 4px;
  padding: 0.25rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.nav-btn:hover {
  background: #000;
  color: #fff;
}

.control {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #000;
  font-weight: 600;
}

.toggle-group {
  display: inline-flex;
  border: 2px solid #000;
  border-radius: 4px;
  overflow: hidden;
}

.toggle {
  border: none;
  background: #fff;
  color: #000;
  padding: 0.3rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border-right: 1px solid #000;
}

.toggle:last-child {
  border-right: none;
}

.toggle.is-active {
  background: #000;
  color: #fff;
}

select {
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.35rem 0.6rem;
  color: #000;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

select:focus {
  outline: 3px solid #000;
  outline-offset: 2px;
}

.calendar-superpowers__body {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.calendar-grid {
  flex: 1.5;
  min-width: 240px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.75rem;
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-transform: uppercase;
  font-size: 0.5rem;
  letter-spacing: 0.15em;
  color: #000;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.day-cell {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.4rem;
  background: #fff;
  color: #000;
  text-align: left;
  min-height: 45px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: default;
  transition: all 0.15s ease;
}

.day-cell:hover {
  border-color: #000;
}

.day-cell.is-muted {
  opacity: 0.3;
  background: #f5f5f5;
}

.day-cell.is-today {
  background: #ffd700;
  border: 3px solid #000;
  font-weight: 700;
  box-shadow: 0 0 0 2px #ffd700;
}

.day-number {
  font-size: 0.9rem;
  font-weight: 700;
  color: #000;
}

.day-weekday {
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: #666;
  font-weight: 600;
}

.day-cell.is-today .day-weekday {
  color: #000;
}

@media (max-width: 820px) {
  .calendar-superpowers__body {
    flex-direction: column;
  }
}
</style>
