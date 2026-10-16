<script setup lang="ts">
import type { MovieMedia } from '#shared/types/extras'

type TabId = 'videos' | 'backdrops' | 'posters'

const props = defineProps<{ movieId: number }>()

const { data, status } = useFetch<MovieMedia>(() => `/api/movies/${props.movieId}/media`, {
  key: `media-${props.movieId}`,
  lazy: true,
  server: false
})

// Only tabs that have something in them.
const tabs = computed(() => {
  const d = data.value
  if (!d) return []
  return [
    { id: 'videos' as const, label: 'Videos', count: d.videos.length },
    { id: 'backdrops' as const, label: 'Backdrops', count: d.backdrops.length },
    { id: 'posters' as const, label: 'Posters', count: d.posters.length }
  ].filter(tab => tab.count > 0)
})

const chosen = ref<TabId>()
const active = computed(() => tabs.value.find(tab => tab.id === chosen.value)?.id ?? tabs.value[0]?.id)

// Arrow keys move between tabs, as in the WAI-ARIA tabs pattern.
function onKeydown(event: KeyboardEvent) {
  const index = tabs.value.findIndex(tab => tab.id === active.value)
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  const next = tabs.value[(index + step + tabs.value.length) % tabs.value.length]
  if (!next) return
  chosen.value = next.id
  event.preventDefault()
  nextTick(() => document.getElementById(`media-tab-${next.id}`)?.focus())
}
</script>

<template>
  <section id="media" aria-labelledby="media-heading" class="scroll-mt-4 space-y-4">
    <h2 id="media-heading" class="text-xl font-bold">Videos and images</h2>

    <p v-if="!data && status !== 'error'" class="text-slate-400">Loading media...</p>
    <p v-else-if="!data" class="text-slate-400">Media could not be loaded.</p>
    <p v-else-if="!tabs.length" class="text-slate-400">No extra videos or images available.</p>

    <template v-else>
      <div role="tablist" aria-label="Media type" class="flex gap-2" @keydown="onKeydown">
        <button
          v-for="tab in tabs"
          :id="`media-tab-${tab.id}`"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="active === tab.id"
          :aria-controls="`media-panel-${tab.id}`"
          :tabindex="active === tab.id ? 0 : -1"
          class="rounded px-3 py-1 text-sm"
          :class="active === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
          @click="chosen = tab.id"
        >
          {{ tab.label }} ({{ tab.count }})
        </button>
      </div>

      <div
        v-if="active === 'videos'"
        id="media-panel-videos"
        role="tabpanel"
        aria-labelledby="media-tab-videos"
      >
        <AppSlider label="videos">
          <li v-for="video in data.videos" :key="video.youtubeKey" class="w-64 shrink-0 snap-start">
            <TrailerPlayer :trailer="video" bare>
              <div class="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
                <img :src="video.thumbUrl" :alt="`${video.name} thumbnail`" loading="lazy" class="h-full w-full object-cover">
                <span class="absolute inset-0 flex items-center justify-center bg-black/30 text-3xl">▶</span>
              </div>
              <p class="mt-1 line-clamp-2 text-sm font-semibold">{{ video.name }}</p>
              <p class="text-xs text-slate-400">{{ video.type }}</p>
            </TrailerPlayer>
          </li>
        </AppSlider>
      </div>

      <div
        v-else-if="active === 'backdrops'"
        id="media-panel-backdrops"
        role="tabpanel"
        aria-labelledby="media-tab-backdrops"
      >
        <AppSlider label="backdrops">
          <li v-for="image in data.backdrops" :key="image.fullUrl" class="w-72 shrink-0 snap-start sm:w-80">
            <a :href="image.fullUrl" target="_blank" rel="noopener" class="block overflow-hidden rounded-lg border border-slate-800 hover:border-indigo-500">
              <img :src="image.thumbUrl" alt="Backdrop" loading="lazy" class="aspect-video w-full object-cover">
            </a>
          </li>
        </AppSlider>
      </div>

      <div
        v-else-if="active === 'posters'"
        id="media-panel-posters"
        role="tabpanel"
        aria-labelledby="media-tab-posters"
      >
        <AppSlider label="posters">
          <li v-for="image in data.posters" :key="image.fullUrl" class="w-36 shrink-0 snap-start sm:w-40">
            <a :href="image.fullUrl" target="_blank" rel="noopener" class="block overflow-hidden rounded-lg border border-slate-800 hover:border-indigo-500">
              <img :src="image.thumbUrl" alt="Poster" loading="lazy" class="aspect-[2/3] w-full object-cover">
            </a>
          </li>
        </AppSlider>
      </div>
    </template>
  </section>
</template>
