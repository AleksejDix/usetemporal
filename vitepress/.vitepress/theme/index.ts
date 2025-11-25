import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Calendar from './components/Calendar.vue'
import CalendarViewState from './components/CalendarViewState.vue'
import WeekNamesView from './components/WeekNamesView.vue'
import NextMonthButton from './components/NextMonthButton.vue'
import PreviousMonthButton from './components/PreviousMonthButton.vue'
import MonthName from './components/MonthName.vue'
import TodayButton from './components/TodayButton.vue'
import YearName from './components/YearName.vue'
import WeekName from './components/WeekName.vue'
import CalendarHeader from './components/CalendarHeader.vue'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Calendar', Calendar)
    app.component('CalendarViewState', CalendarViewState)
    app.component('WeekNamesView', WeekNamesView)
    app.component('NextMonthButton', NextMonthButton)
    app.component('PreviousMonthButton', PreviousMonthButton)
    app.component('MonthName', MonthName)
    app.component('TodayButton', TodayButton)
    app.component('YearName', YearName)
    app.component('WeekName', WeekName)
    app.component('CalendarHeader', CalendarHeader)
  }
} satisfies Theme
