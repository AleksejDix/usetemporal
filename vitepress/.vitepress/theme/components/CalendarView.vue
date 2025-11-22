<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-button">‹</button>
      <h3 class="month-title">{{ monthName }}</h3>
      <button @click="nextMonth" class="nav-button">›</button>
    </div>

    <div class="calendar-grid">
      <!-- Weekday headers -->
      <div
        v-for="day in weekDays"
        :key="day"
        class="weekday-header"
      >
        {{ day }}
      </div>

      <!-- Calendar days -->
      <div
        v-for="(day, index) in days"
        :key="index"
        :class="getDayClasses(day)"
      >
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'
import { createStableMonth } from '@allystudio/usetemporal/calendar'
import { divide, next, previous } from '@allystudio/usetemporal/operations'
import type { Period } from '@allystudio/usetemporal/types'

// Create temporal instance with native adapter
const adapter = createNativeAdapter()
const temporal = createTemporal({ adapter, weekStartsOn: 1 })

// Current browsing month
const currentMonth = ref<Date>(new Date())

// Weekday names (starting with Monday based on weekStartsOn: 1)
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Month name for header
const monthName = computed(() =>
  currentMonth.value.toLocaleDateString('en', {
    month: 'long',
    year: 'numeric'
  })
)

// Create stable month period (42 days / 6 weeks)
const stableMonth = computed(() =>
  createStableMonth(adapter, 1, currentMonth.value)
)

// Divide stable month into days
const days = computed(() =>
  divide(adapter, stableMonth.value, 'day')
)

// Navigation methods
const previousMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  )
}

// Check if a day is in the current month
const isCurrentMonth = (day: Period) => {
  return day.date.getMonth() === currentMonth.value.getMonth()
}

// Check if a day is today
const isToday = (day: Period) => {
  const today = new Date()
  return day.date.getDate() === today.getDate() &&
         day.date.getMonth() === today.getMonth() &&
         day.date.getFullYear() === today.getFullYear()
}

// Check if a day is weekend
const isWeekend = (day: Period) => {
  const dayOfWeek = day.date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

// Get CSS classes for a day
const getDayClasses = (day: Period) => ({
  'calendar-day': true,
  'other-month': !isCurrentMonth(day),
  'current-month': isCurrentMonth(day),
  'today': isToday(day),
  'weekend': isWeekend(day)
})
</script>

<style scoped>
.calendar-view {
  max-width: 400px;
  margin: 2rem auto;
  font-family: var(--vp-font-family-base);
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.month-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
}

.nav-button {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background: var(--vp-c-brand-dark);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.weekday-header {
  text-align: center;
  font-weight: 600;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: default;
  color: var(--vp-c-text-1);
}

.calendar-day.current-month {
  background: var(--vp-c-bg);
  font-weight: 500;
}

.calendar-day.other-month {
  color: var(--vp-c-text-3);
  opacity: 0.4;
}

.calendar-day.today {
  background: var(--vp-c-brand);
  color: white;
  font-weight: 700;
}

.calendar-day.weekend:not(.today) {
  color: var(--vp-c-text-2);
}

.calendar-day.current-month:hover:not(.today) {
  background: var(--vp-c-bg-alt);
}
</style>
