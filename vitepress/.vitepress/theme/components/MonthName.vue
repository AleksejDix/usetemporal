<script setup lang="ts">
import { useTemporal, usePeriod } from "@allystudio/usetemporal-vue";

const temporal = useTemporal();
const month = usePeriod(temporal, "month");

const formatter = new Intl.DateTimeFormat(temporal.locale, { month: "long" });

</script>

<template>
  <span class="temporal-month-name">
    {{ formatter.format(month.start) }}
  </span>
</template>
