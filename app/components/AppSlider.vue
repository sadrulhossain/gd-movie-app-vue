<script setup lang="ts">
// A horizontally scrolling list with prev/next buttons. Put <li class="shrink-0 snap-start w-..."> items in the slot.
defineProps<{ label: string }>()

const track = useTemplateRef<HTMLElement>('track')
const canPrev = ref(false)
const canNext = ref(false)

function update() {
  const el = track.value
  if (!el) return
  canPrev.value = el.scrollLeft > 4
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

function page(direction: 1 | -1) {
  const el = track.value
  if (!el) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: reduceMotion ? 'auto' : 'smooth' })
}

// Measuring needs the browser, so the buttons only appear after mount (nothing to hydrate-mismatch).
onMounted(() => {
  update()
  window.addEventListener('resize', update)
})
onBeforeUnmount(() => window.removeEventListener('resize', update))
</script>

<template>
  <div class="relative">
    <ul
      ref="track"
      role="list"
      :aria-label="label"
      class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @scroll.passive="update"
    >
      <slot />
    </ul>

    <button
      v-if="canPrev"
      type="button"
      class="absolute left-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-lg hover:bg-black sm:flex"
      :aria-label="`Previous ${label}`"
      @click="page(-1)"
    >
      ‹
    </button>
    <button
      v-if="canNext"
      type="button"
      class="absolute right-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-lg hover:bg-black sm:flex"
      :aria-label="`Next ${label}`"
      @click="page(1)"
    >
      ›
    </button>
  </div>
</template>
