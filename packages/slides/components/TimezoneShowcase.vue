<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const reference = new Date("2025-03-13T12:00:00Z");
const now = ref(new Date());

const zones = [
  { label: "Niue", tz: "Pacific/Niue", note: "Last place on Earth" },
  { label: "New York", tz: "America/New_York", note: "US East Coast (DST)" },
  { label: "Zurich", tz: "Europe/Zurich", note: "Swiss office time" },
  { label: "Singapore", tz: "Asia/Singapore", note: "No DST" },
  { label: "Kiritimati", tz: "Pacific/Kiritimati", note: "First place on Earth" },
];

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const zoneRows = computed(() =>
  zones.map((zone) => {
    const referenceLocal = toZonedDate(reference, zone.tz);
    const currentLocal = toZonedDate(now.value, zone.tz);
    const offset = (referenceLocal.getTime() - reference.getTime()) / 3600000;

    const timeFormatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: zone.tz,
    });

    const weekdayFormatter = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: zone.tz,
    });

    const referenceTime = timeFormatter.format(reference);
    const referenceDay = weekdayFormatter.format(reference);
    const currentTime = timeFormatter.format(now.value);
    const currentDay = weekdayFormatter.format(now.value);
    const dayShift = getRelativeDay(currentLocal, now.value);

    return {
      ...zone,
      offset,
      referenceTime,
      referenceDay,
      currentTime,
      currentDay,
      dayShift,
    };
  })
);

function toZonedDate(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = dtf.formatToParts(date);
  const map: Record<string, number> = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      map[part.type] = Number(part.value);
    }
  });

  return new Date(
    Date.UTC(
      map.year,
      (map.month ?? 1) - 1,
      map.day ?? 1,
      map.hour ?? 0,
      map.minute ?? 0,
      map.second ?? 0
    )
  );
}

function getRelativeDay(local: Date, reference: Date) {
  const diffDays = Math.round((local.getTime() - reference.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";
  return diffDays > 0 ? `+${diffDays}d` : `${diffDays}d`;
}
</script>

<template>
  <section class="tz-showcase">
    <header>
      <div>
        <p class="eyebrow">Reference (UTC)</p>
        <h4>March 13 · 12:00 UTC</h4>
      </div>
      <p class="hint">
        Slide to the extremes: Niue is still yesterday while Kiritimati is tomorrow.
      </p>
    </header>
    <div class="rows">
      <div class="row header-row">
        <span>Zone</span>
        <span>Reference</span>
        <span>Live Now</span>
        <span>Relative Day</span>
        <span>UTC Offset</span>
      </div>
      <div
        v-for="zone in zoneRows"
        :key="zone.tz"
        class="row"
        :class="{ future: zone.offset > 0, past: zone.offset < 0 }"
      >
        <span>
          <strong>{{ zone.label }}</strong>
          <small>{{ zone.note }}</small>
        </span>
        <span>
          {{ zone.referenceTime }}
          <small>{{ zone.referenceDay }}</small>
        </span>
        <span>
          {{ zone.currentTime }}
          <small>{{ zone.currentDay }}</small>
        </span>
        <span>{{ zone.dayShift }}</span>
        <span>{{ zone.offset >= 0 ? "+" : "" }}{{ zone.offset }}h</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tz-showcase {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 1rem;
  background: rgba(15, 18, 40, 0.35);
  backdrop-filter: blur(8px);
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.row {
  display: grid;
  grid-template-columns: 1.1fr 1.2fr 1.2fr 0.8fr 0.7fr;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  align-items: center;
  font-size: 0.85rem;
}

.row span {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.row span small {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.65);
}

.header-row {
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
}

.row.future {
  border: 1px solid rgba(78, 197, 212, 0.4);
  background: rgba(78, 197, 212, 0.08);
}

.row.past {
  border: 1px solid rgba(255, 170, 61, 0.4);
  background: rgba(255, 170, 61, 0.08);
}
</style>
