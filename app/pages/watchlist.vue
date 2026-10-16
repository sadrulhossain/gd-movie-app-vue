<script setup lang="ts">
useHead({ title: 'Watchlist' })

const watchlist = useWatchlistStore()
const route = useRoute()

const tabs = [
  { label: 'All', status: undefined },
  { label: 'Want to watch', status: 'want' },
  { label: 'Watched', status: 'watched' }
] as const

const filter = computed(() => tabs.find(tab => tab.status === route.query.status) ?? tabs[0])
const visible = computed(() =>
  filter.value.status ? watchlist.items.filter(item => item.status === filter.value.status) : watchlist.items
)
</script>

<template>
  <section class="space-y-6">
    <h1 class="text-2xl font-bold">Watchlist</h1>

    <nav class="flex gap-2" aria-label="Filter watchlist">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.label"
        :to="tab.status ? { query: { status: tab.status } } : { query: {} }"
        class="rounded px-3 py-1 text-sm"
        :class="tab === filter ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
      >
        {{ tab.label }}
      </NuxtLink>
    </nav>

    <!-- The list lives in the browser, so the server can't render it: wait for the store to load. -->
    <div v-if="!watchlist.ready" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <MovieCardSkeleton v-for="n in 5" :key="n" />
    </div>

    <p v-else-if="!watchlist.items.length" class="text-slate-400">
      Your watchlist is empty. <NuxtLink to="/" class="underline hover:text-white">Browse movies</NuxtLink> and add some.
    </p>

    <p v-else-if="!visible.length" class="text-slate-400">Nothing here yet.</p>

    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <MovieCard v-for="item in visible" :key="item.id" :movie="item" />
    </div>
  </section>
</template>
