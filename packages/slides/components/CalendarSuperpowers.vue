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

  return {
    iso,
    date: day,
    inMonth,
    isWeekend,
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
              'is-weekend': day.isWeekend,
              'is-reserved': day.tags.includes('reserved'),
              'is-blackout': day.tags.includes('blackout'),
            }"
          >
            <span class="day-number">{{ day.label }}</span>
            <span class="day-weekday">{{ day.weekday }}</span>
          </button>
        </div>
      </div>

      <aside class="superpower-panel">
        <h4>Superpowers in this view</h4>
        <ul>
          <li>
            Stable six-row grid with {{ featureStats.outsideDays }} padded cells
            — UI never jumps even in February.
          </li>
          <li>
            Timezone toggle shows {{ featureStats.timezone }} instantly — data
            stays accurate, labels reformat.
          </li>
          <li>
            Reserved windows ({{ featureStats.reservedDays }} cells) and
            blackout ranges live alongside normal days with zero additional
            logic.
          </li>
        </ul>
        <div class="legend">
          <span><span class="legend-chip reserved"></span> Launch sprint</span>
          <span><span class="legend-chip blackout"></span> Blackout</span>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.calendar-superpowers {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 1rem;
  background: rgba(15, 18, 40, 0.35);
  backdrop-filter: blur(8px);
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
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.calendar-superpowers__controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align.items: flex-end;
}

.nav-group {
  display: inline-flex;
  gap: 0.35rem;
}

.nav-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 999px;
  padding: 0.25rem 0.7rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.15s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.control {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.toggle-group {
  display: inline-flex;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  overflow: hidden;
}

.toggle {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.3rem 0.8rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.toggle.is-active {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

select {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.35rem 0.6rem;
  color: #fff;
  font-size: 0.75rem;
}

.calendar-superpowers__body {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.calendar-grid {
  flex: 1.5;
  min-width: 240px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 14px;
  padding: 0.45rem;
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-transform: uppercase;
  font-size: 0.5rem;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.25rem;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.2rem;
  margin-bottom: 0.2rem;
}

.day-cell {
  border: none;
  border-radius: 10px;
  padding: 0.3rem;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  text-align: left;
  min-height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: default;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.day-cell.is-muted {
  opacity: 0.45;
}

.day-cell.is-weekend {
  background: rgba(255, 255, 255, 0.08);
}

.day-cell.is-reserved {
  background: linear-gradient(
    135deg,
    rgba(78, 197, 212, 0.25),
    rgba(20, 107, 140, 0.6)
  );
}

.day-cell.is-blackout {
  background: rgba(255, 85, 85, 0.2);
  border: 1px solid rgba(255, 85, 85, 0.4);
}

.day-number {
  font-size: 0.8rem;
  font-weight: 600;
}

.day-weekday {
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: rgba(255, 255, 255, 0.6);
}

.superpower-panel {
  flex: 1;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.8rem;
}

.superpower-panel ul {
  margin: 0;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.legend {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
}

.legend-chip {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-right: 0.3rem;
}

.legend-chip.reserved {
  background: linear-gradient(
    135deg,
    rgba(78, 197, 212, 0.7),
    rgba(20, 107, 140, 0.9)
  );
}

.legend-chip.blackout {
  background: rgba(255, 85, 85, 0.8);
}

@media (max-width: 820px) {
  .calendar-superpowers__body {
    flex-direction: column;
  }
}
</style>
