// Tiny store to prove Pinia works (and to demo server -> client hydration).
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  // Set once during SSR; the client receives this value instead of recomputing it.
  const initializedOn = ref(import.meta.server ? 'server' : 'client')

  function increment() {
    count.value++
  }

  return { count, initializedOn, increment }
})
