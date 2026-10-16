<script setup lang="ts">
import type { MovieDetails } from '#shared/types/movie'

const route = useRoute()
const id = String(route.params.id)

// Same key on server and client: the client reuses the server's payload instead of refetching.
const { data: movie, error, refresh } = await useFetch<MovieDetails>(`/api/movies/${id}`, {
  key: `movie-${id}`
})

// Bad id (400) or unknown movie (404): show Nuxt's 404 page. Other errors render inline below.
if (error.value && [400, 404].includes(error.value.statusCode ?? 0)) {
  throw createError({ statusCode: 404, statusMessage: 'Movie not found', fatal: true })
}

const year = computed(() => movie.value?.releaseDate?.slice(0, 4))
const runtime = computed(() => {
  const minutes = movie.value?.runtime
  return minutes ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : null
})

useSeoMeta({
  title: () => movie.value?.title,
  description: () => movie.value?.overview,
  ogTitle: () => movie.value?.title,
  ogDescription: () => movie.value?.overview,
  ogImage: () => movie.value?.posterUrl ?? undefined,
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div v-if="error" class="space-y-3 rounded-lg border border-red-900 bg-red-950/40 p-4">
    <p>{{ error.statusMessage || 'Something went wrong.' }}</p>
    <button type="button" class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700" @click="refresh()">
      Try again
    </button>
  </div>

  <article v-else-if="movie" class="space-y-8">
    <NuxtLink to="/" class="text-sm text-slate-400 hover:text-white">← Back to movies</NuxtLink>

    <div class="relative overflow-hidden rounded-xl bg-slate-900">
      <img
        v-if="movie.backdropUrl"
        :src="movie.backdropUrl"
        alt=""
        fetchpriority="high"
        class="absolute inset-0 h-full w-full object-cover opacity-30"
      >
      <div class="relative flex flex-col gap-6 p-4 sm:flex-row sm:p-8">
        <div class="mx-auto w-48 shrink-0 sm:mx-0 sm:w-56">
          <img
            v-if="movie.posterUrl"
            :src="movie.posterUrl"
            :alt="`${movie.title} poster`"
            fetchpriority="high"
            class="aspect-[2/3] w-full rounded-lg object-cover shadow-lg"
          >
          <div v-else class="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-slate-800 text-sm text-slate-500">
            No poster
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h1 class="text-3xl font-bold">
              {{ movie.title }}<span v-if="year" class="font-normal text-slate-400"> ({{ year }})</span>
            </h1>
            <p v-if="movie.tagline" class="mt-1 italic text-slate-400">{{ movie.tagline }}</p>
          </div>

          <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
            <span class="font-semibold text-amber-400">★ {{ movie.rating.toFixed(1) }}</span>
            <span v-if="runtime">{{ runtime }}</span>
            <span v-if="movie.genres.length">{{ movie.genres.join(', ') }}</span>
          </p>

          <p v-if="movie.overview" class="max-w-prose text-slate-200">{{ movie.overview }}</p>

          <a
            v-if="movie.trailer"
            :href="movie.trailer.url"
            target="_blank"
            rel="noopener"
            class="inline-block rounded bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500"
          >
            ▶ Watch trailer on YouTube
          </a>
        </div>
      </div>
    </div>

    <section v-if="movie.cast.length" aria-labelledby="cast-heading">
      <h2 id="cast-heading" class="mb-4 text-xl font-bold">Cast</h2>
      <ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <li v-for="person in movie.cast" :key="person.id" class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
          <img
            v-if="person.profileUrl"
            :src="person.profileUrl"
            :alt="person.name"
            loading="lazy"
            class="aspect-[2/3] w-full object-cover"
          >
          <div v-else class="flex aspect-[2/3] w-full items-center justify-center bg-slate-800 text-xs text-slate-500">
            No photo
          </div>
          <div class="p-2">
            <p class="text-sm font-semibold">{{ person.name }}</p>
            <p class="text-xs text-slate-400">{{ person.character }}</p>
          </div>
        </li>
      </ul>
    </section>
  </article>
</template>
