<script setup lang="ts">
import type { MovieMedia } from '#shared/types/extras'

const props = defineProps<{ movieId: number }>()

const { data, status } = useFetch<MovieMedia>(() => `/api/movies/${props.movieId}/media`, {
  key: `media-${props.movieId}`,
  lazy: true,
  server: false
})

const isEmpty = computed(
  () => !!data.value && !data.value.videos.length && !data.value.backdrops.length && !data.value.posters.length
)
</script>

<template>
  <section id="media" aria-labelledby="media-heading" class="scroll-mt-4 space-y-6">
    <h2 id="media-heading" class="text-xl font-bold">Videos and images</h2>

    <p v-if="!data && status !== 'error'" class="text-slate-400">Loading media...</p>
    <p v-else-if="!data" class="text-slate-400">Media could not be loaded.</p>
    <p v-else-if="isEmpty" class="text-slate-400">No extra videos or images available.</p>

    <template v-else>
      <div v-if="data.videos.length" class="space-y-3">
        <h3 class="text-sm font-semibold text-slate-300">Videos</h3>
        <ul class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <li v-for="video in data.videos" :key="video.youtubeKey">
            <TrailerPlayer :trailer="video" bare>
              <div class="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
                <img :src="video.thumbUrl" :alt="`${video.name} thumbnail`" loading="lazy" class="h-full w-full object-cover">
                <span class="absolute inset-0 flex items-center justify-center bg-black/30 text-3xl">▶</span>
              </div>
              <p class="mt-1 line-clamp-2 text-sm font-semibold">{{ video.name }}</p>
              <p class="text-xs text-slate-400">{{ video.type }}</p>
            </TrailerPlayer>
          </li>
        </ul>
      </div>

      <div v-if="data.backdrops.length" class="space-y-3">
        <h3 class="text-sm font-semibold text-slate-300">Backdrops</h3>
        <ul class="grid grid-cols-2 gap-4 md:grid-cols-3">
          <li v-for="image in data.backdrops" :key="image.fullUrl">
            <a :href="image.fullUrl" target="_blank" rel="noopener" class="block overflow-hidden rounded-lg border border-slate-800 hover:border-indigo-500">
              <img :src="image.thumbUrl" alt="Backdrop" loading="lazy" class="aspect-video w-full object-cover">
            </a>
          </li>
        </ul>
      </div>

      <div v-if="data.posters.length" class="space-y-3">
        <h3 class="text-sm font-semibold text-slate-300">Posters</h3>
        <ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <li v-for="image in data.posters" :key="image.fullUrl">
            <a :href="image.fullUrl" target="_blank" rel="noopener" class="block overflow-hidden rounded-lg border border-slate-800 hover:border-indigo-500">
              <img :src="image.thumbUrl" alt="Poster" loading="lazy" class="aspect-[2/3] w-full object-cover">
            </a>
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>
