<script setup lang="ts">
import type { WatchlistItem, WatchStatus } from '#shared/types/watchlist'

defineProps<{
  movie: Pick<WatchlistItem, 'id' | 'title' | 'posterPath'>
  compact?: boolean
}>()

const watchlist = useWatchlistStore()

const options: { status: WatchStatus, label: string }[] = [
  { status: 'want', label: 'Want to watch' },
  { status: 'watched', label: 'Watched' }
]
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="option in options"
      :key="option.status"
      type="button"
      :aria-pressed="watchlist.statusOf(movie.id) === option.status"
      class="rounded border font-medium transition"
      :class="[
        compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        watchlist.statusOf(movie.id) === option.status
          ? 'border-indigo-500 bg-indigo-600 text-white'
          : 'border-slate-700 text-slate-300 hover:border-slate-500'
      ]"
      @click="watchlist.toggle(movie, option.status)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
