<script setup lang="ts">
import type { MovieSummary, Paginated } from '#shared/types/movie'

const route = useRoute()
const router = useRouter()

// The URL is the source of truth: ?q=&page=
const q = computed(() => String(route.query.q ?? '').trim())
const page = computed(() => {
  const n = Number(route.query.page)
  return Number.isInteger(n) && n >= 1 ? n : 1
})

// Search box: typing is debounced before it touches the URL.
const input = ref(q.value)
const debouncedInput = useDebouncedRef(input, 400)

watch(debouncedInput, (value) => {
  const next = value.trim()
  if (next !== q.value) {
    router.replace({ query: next ? { q: next } : {} }) // new search resets page
  }
})

// Back/forward buttons change the URL; mirror it into the box.
watch(q, (value) => {
  if (value !== input.value.trim()) input.value = value
})

const isSearch = computed(() => q.value !== '')
const endpoint = computed(() => (isSearch.value ? '/api/movies/search' : '/api/movies/trending'))
const params = computed(() => (isSearch.value ? { query: q.value, page: page.value } : { page: page.value }))

const { data, status, error, refresh } = await useFetch<Paginated<MovieSummary>>(endpoint, { query: params })

const totalPages = computed(() => data.value?.totalPages ?? 1)

function pageLink(n: number) {
  return { query: { ...(isSearch.value ? { q: q.value } : {}), ...(n > 1 ? { page: n } : {}) } }
}

watch(page, () => window.scrollTo({ top: 0 }))
</script>

<template>
  <section class="space-y-6">
    <form role="search" @submit.prevent="input = input.trim()">
      <label for="search" class="sr-only">Search movies</label>
      <input
        id="search"
        v-model="input"
        type="search"
        placeholder="Search movies..."
        autocomplete="off"
        class="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 outline-none focus:border-indigo-500"
      >
    </form>

    <h1 class="text-2xl font-bold">
      {{ isSearch ? `Results for “${q}”` : 'Trending this week' }}
    </h1>

    <div v-if="status === 'pending'" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <MovieCardSkeleton v-for="n in 10" :key="n" />
    </div>

    <div v-else-if="error" class="space-y-3 rounded-lg border border-red-900 bg-red-950/40 p-4">
      <p>{{ error.statusMessage || 'Something went wrong.' }}</p>
      <button type="button" class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700" @click="refresh()">
        Try again
      </button>
    </div>

    <p v-else-if="!data?.results.length" class="text-slate-400">
      No movies found{{ isSearch ? ` for “${q}”` : '' }}.
    </p>

    <template v-else>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <MovieCard v-for="movie in data.results" :key="movie.id" :movie="movie" />
      </div>

      <nav v-if="totalPages > 1" class="flex items-center justify-center gap-4" aria-label="Pagination">
        <NuxtLink v-if="page > 1" :to="pageLink(page - 1)" class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">
          Previous
        </NuxtLink>
        <span v-else class="rounded px-3 py-1 text-slate-600">Previous</span>

        <span class="text-sm text-slate-400">Page {{ page }} of {{ totalPages }}</span>

        <NuxtLink v-if="page < totalPages" :to="pageLink(page + 1)" class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700">
          Next
        </NuxtLink>
        <span v-else class="rounded px-3 py-1 text-slate-600">Next</span>
      </nav>
    </template>
  </section>
</template>
