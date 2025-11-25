<script setup lang="ts">
import { useTemporal } from "@allystudio/usetemporal-vue";

const { now, go } = useTemporal();
</script>

<template>
  <button class="temporal-nav-button" @click="go(now, 0)">
    <slot>Today</slot>
  </button>
</template>
