import type { Ref } from 'vue'

/**
 * True when a line-clamped element is actually cut off, measured in the browser, so "Read more"
 * only shows when there is more to read (a character count cannot tell: line breaks and width matter).
 */
export function useIsClamped(target: Ref<HTMLElement | null>, expanded: Ref<boolean>) {
  const clamped = ref(false)

  function measure() {
    const el = target.value
    if (!el || expanded.value) return // an expanded element is not cut off, so its size says nothing
    clamped.value = el.scrollHeight > el.clientHeight + 1
  }

  onMounted(() => {
    measure()
    window.addEventListener('resize', measure)
  })
  onBeforeUnmount(() => window.removeEventListener('resize', measure))

  // After collapsing again, measure with the clamp back in place.
  watch(expanded, async (isExpanded) => {
    if (!isExpanded) {
      await nextTick()
      measure()
    }
  })

  return clamped
}
