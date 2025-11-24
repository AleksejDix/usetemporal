import { useTemporal } from '@allystudio/usetemporal-vue'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

// Create a single shared temporal instance
export const temporal = useTemporal({
  date: new Date(),
  adapter: createNativeAdapter({ weekStartsOn: 1 }),
  weekStartsOn: 1, // Monday
})
