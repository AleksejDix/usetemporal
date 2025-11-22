import DefaultTheme from 'vitepress/theme'
import CalendarView from './components/CalendarView.vue'
import type { Theme } from 'vitepress'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register CalendarView component globally
    app.component('CalendarView', CalendarView)
  }
} satisfies Theme
