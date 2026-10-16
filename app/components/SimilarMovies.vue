<script setup lang="ts">
import type { MovieSummary } from '#shared/types/movie'

const props = defineProps<{ movieId: number }>()

const { data, status } = useFetch<MovieSummary[]>(() => `/api/movies/${props.movieId}/recommendations`, {
  key: `recommendations-${props.movieId}`,
  lazy: true,
  server: false
})
</script>

<template>
  <section id="similar" aria-labelledby="similar-heading" class="scroll-mt-4 space-y-4">
    <h2 id="similar-heading" class="text-xl font-bold">You might also like</h2>

    <p v-if="!data && status !== 'error'" class="text-slate-400">Loading recommendations...</p>
    <p v-else-if="!data" class="text-slate-400">Recommendations could not be loaded.</p>
    <p v-else-if="!data.length" class="text-slate-400">No recommendations available.</p>

    <AppSlider v-else label="similar movies">
      <li v-for="movie in data" :key="movie.id" class="w-40 shrink-0 snap-start sm:w-44">
        <MovieCard :movie="movie" />
      </li>
    </AppSlider>
  </section>
</template>
