import type { Ref } from 'vue'

/** A ref that follows `source` after it has stopped changing for `delay` ms. */
export function useDebouncedRef<T>(source: Ref<T>, delay = 400): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined

  // Only runs when `source` changes, so timers are never created during SSR.
  watch(source, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  onScopeDispose(() => clearTimeout(timer))
  return debounced
}
