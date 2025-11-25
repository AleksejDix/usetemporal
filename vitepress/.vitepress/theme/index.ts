import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp() {
    // No custom global components
  }
} satisfies Theme
