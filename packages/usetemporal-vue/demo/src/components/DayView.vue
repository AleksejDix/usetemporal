<script setup lang="ts">
import { computed } from "vue";
import type { Period } from "@allystudio/usetemporal";
import { useTemporal } from "@allystudio/usetemporal-vue";

const props = defineProps<{
  day: Period;
}>();

const temporal = useTemporal();
const hours = computed(() => temporal.divide(props.day, "hour"));

const guideSlots = computed(() =>
  hours.value.filter((_, index) => index % 3 === 0).map((slot) => slot.start)
);

const friendlyDate = computed(() =>
  props.day.start.toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
);
</script>

<template>
  <section class="panel-card day-view">
    <header>
      <p class="eyebrow">Day focus</p>
      <h3>{{ friendlyDate }}</h3>
    </header>
    <div class="day-timeline">
      <div
        v-for="timestamp in guideSlots"
        :key="timestamp.toISOString()"
        class="timeline-row"
      >
        <span class="time">{{
          timestamp.toLocaleTimeString("en", { hour: "numeric" })
        }}</span>
        <div class="slot"></div>
      </div>
    </div>
  </section>
</template>
