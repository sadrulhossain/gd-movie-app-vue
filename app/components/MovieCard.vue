<script setup lang="ts">
import type { MovieSummary } from '#shared/types/movie'

// Accepts a full search result or just what the watchlist stores.
const props = defineProps<{
  movie: Pick<MovieSummary, 'id' | 'title' | 'posterPath'> & Partial<Pick<MovieSummary, 'rating' | 'releaseDate'>>
}>()

const posterUrl = computed(() => tmdbImageUrl(props.movie.posterPath, 'w500'))
const year = computed(() => props.movie.releaseDate?.slice(0, 4) ?? null)
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 transition hover:border-indigo-500">
    <NuxtLink :to="`/movies/${movie.id}`" class="block">
      <div class="relative aspect-[2/3] bg-slate-800">
        <img
          v-if="posterUrl"
          :src="posterUrl"
          :alt="`${movie.title} poster`"
          loading="lazy"
          class="h-full w-full object-cover"
        >
        <div v-else class="flex h-full items-center justify-center p-4 text-center text-sm text-slate-500">
          No poster
        </div>
        <span
          v-if="movie.rating !== undefined"
          class="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-semibold text-amber-400"
        >
          ★ {{ movie.rating.toFixed(1) }}
        </span>
      </div>
      <div class="px-3 pt-3">
        <h3 class="line-clamp-2 text-sm font-semibold">{{ movie.title }}</h3>
        <p v-if="year" class="mt-1 text-xs text-slate-400">{{ year }}</p>
      </div>
    </NuxtLink>
    <!-- Outside the link: buttons must not be nested inside an <a> -->
    <div class="p-3">
      <WatchlistButtons :movie="movie" compact />
    </div>
  </div>
</template>
