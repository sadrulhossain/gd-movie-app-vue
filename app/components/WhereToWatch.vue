<script setup lang="ts">
import type { WatchProviders } from '#shared/types/providers'

const props = defineProps<{ movieId: number }>()

// undefined = let the server pick the visitor's country; a dropdown choice overrides it.
const chosen = ref<string>()

// Browser-only: the request then carries the visitor's own Cloudflare country header.
const { data, status } = useFetch<WatchProviders>(() => `/api/movies/${props.movieId}/providers`, {
  query: computed(() => ({ region: chosen.value })),
  key: `providers-${props.movieId}`,
  lazy: true,
  server: false
})

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
const countryName = (code: string) => {
  try {
    return regionNames.of(code) ?? code
  } catch {
    return code
  }
}

const options = computed(() =>
  (data.value?.regions ?? [])
    .map(code => ({ code, name: countryName(code) }))
    .sort((a, b) => a.name.localeCompare(b.name))
)

const groups = computed(() => {
  const d = data.value
  if (!d) return []
  return [
    { label: 'Stream', providers: d.flatrate },
    { label: 'Free with ads', providers: d.ads },
    { label: 'Rent', providers: d.rent },
    { label: 'Buy', providers: d.buy }
  ].filter(group => group.providers.length)
})
</script>

<template>
  <section id="where-to-watch" aria-labelledby="watch-heading" class="scroll-mt-4 space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 id="watch-heading" class="text-xl font-bold">Where to watch</h2>

      <div v-if="options.length" class="flex items-center gap-2 text-sm">
        <label for="region" class="text-slate-400">Country</label>
        <select
          id="region"
          :value="data?.region"
          class="rounded border border-slate-700 bg-slate-900 px-2 py-1"
          @change="chosen = ($event.target as HTMLSelectElement).value"
        >
          <!-- The detected country may have no data for this movie: still show it as the current value. -->
          <option v-if="data && !data.regions.includes(data.region)" :value="data.region">
            {{ countryName(data.region) }}
          </option>
          <option v-for="option in options" :key="option.code" :value="option.code">{{ option.name }}</option>
        </select>
      </div>
    </div>

    <!-- On the server the fetch is skipped (status "idle"), so anything that is not an error counts as loading. -->
    <p v-if="!data && status !== 'error'" class="text-slate-400">Loading availability...</p>

    <p v-else-if="!data" class="text-slate-400">Availability could not be loaded.</p>

    <template v-else>
      <p v-if="!groups.length" class="text-slate-400">
        Not available to stream, rent or buy in {{ countryName(data.region) }}.
        <span v-if="options.length">Try another country.</span>
      </p>

      <div v-for="group in groups" :key="group.label" class="space-y-2">
        <h3 class="text-sm font-semibold text-slate-300">{{ group.label }}</h3>
        <ul class="flex flex-wrap gap-3">
          <li v-for="provider in group.providers" :key="provider.id" class="flex w-20 flex-col items-center gap-1 text-center">
            <img
              v-if="provider.logoUrl"
              :src="provider.logoUrl"
              :alt="provider.name"
              loading="lazy"
              class="h-12 w-12 rounded-lg"
            >
            <span class="text-xs text-slate-400">{{ provider.name }}</span>
          </li>
        </ul>
      </div>

      <a
        v-if="data.link"
        :href="data.link"
        target="_blank"
        rel="noopener"
        class="inline-block text-sm text-indigo-400 hover:text-indigo-300"
      >
        See all options on TMDB →
      </a>
    </template>

    <p class="text-xs text-slate-500">
      Streaming availability data provided by
      <a href="https://www.justwatch.com" target="_blank" rel="noopener" class="underline hover:text-slate-300">JustWatch</a>.
    </p>
  </section>
</template>
