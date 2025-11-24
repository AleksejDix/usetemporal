<script setup lang="ts">
import { computed } from "vue";
import type { Period } from "@allystudio/usetemporal";
import { useTemporal } from "@allystudio/usetemporal-vue";

const props = defineProps<{
  week: Period;
  selected: Period;
}>();

const emit = defineEmits<{ (e: "select", day: Period): void }>();

const temporal = useTemporal();
const days = computed(() => temporal.divide(props.week, "day"));
const isSelected = (day: Period) => temporal.contains(day, props.selected);

function select(day: Period) {
  emit("select", day);
}
</script>

<template>
  <section class="panel-card week-view">
    <header>
      <p class="eyebrow">Week view</p>
      <h3>
        {{ days[0]?.start.toLocaleDateString("en", { month: "short", day: "numeric" }) }}
        –
        {{ days[days.length - 1]?.start.toLocaleDateString("en", { month: "short", day: "numeric" }) }}
      </h3>
    </header>
    <div class="week-strip">
      <button
        v-for="day in days"
        :key="day.start.toISOString()"
        class="week-day"
        :class="{ active: isSelected(day) }"
        @click="select(day)"
      >
        <span class="dow">{{ day.start.toLocaleDateString("en", { weekday: "short" }) }}</span>
        <strong>{{ day.start.getDate() }}</strong>
      </button>
    </div>
  </section>
</template>
