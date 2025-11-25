import { ref } from 'vue'
import { createTemporal } from '@allystudio/usetemporal-vue'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

// Create a single shared temporal instance
export const temporal = createTemporal({
  date: ref(new Date()),
  adapter: createNativeAdapter({ weekStartsOn: 1 }),
  weekStartsOn: 1, // Monday
})
