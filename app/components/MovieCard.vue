<script setup lang="ts">
import type { MovieSummary } from '#shared/types/movie'

const props = defineProps<{ movie: MovieSummary }>()

const year = computed(() => props.movie.releaseDate?.slice(0, 4) ?? 'TBA')
</script>

<template>
  <article class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
    <div class="relative aspect-[2/3] bg-slate-800">
      <img
        v-if="movie.posterUrl"
        :src="movie.posterUrl"
        :alt="`${movie.title} poster`"
        loading="lazy"
        class="h-full w-full object-cover"
      >
      <div v-else class="flex h-full items-center justify-center p-4 text-center text-sm text-slate-500">
        No poster
      </div>
      <span class="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-semibold text-amber-400">
        ★ {{ movie.rating.toFixed(1) }}
      </span>
    </div>
    <div class="p-3">
      <h3 class="line-clamp-2 text-sm font-semibold">{{ movie.title }}</h3>
      <p class="mt-1 text-xs text-slate-400">{{ year }}</p>
    </div>
  </article>
</template>
