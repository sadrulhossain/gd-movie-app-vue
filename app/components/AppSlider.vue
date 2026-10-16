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
      class="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-900 shadow-lg shadow-black/60 ring-1 ring-slate-300 transition hover:bg-indigo-500 hover:text-white hover:ring-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-400 sm:flex"
      :aria-label="`Previous ${label}`"
      @click="page(-1)"
    >
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 4 6 10l6 6" />
      </svg>
    </button>
    <button
      v-if="canNext"
      type="button"
      class="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-900 shadow-lg shadow-black/60 ring-1 ring-slate-300 transition hover:bg-indigo-500 hover:text-white hover:ring-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-400 sm:flex"
      :aria-label="`Next ${label}`"
      @click="page(1)"
    >
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m8 4 6 6-6 6" />
      </svg>
    </button>
  </div>
</template>
