<script setup lang="ts">
import type { Genre } from '#shared/types/movie'

const props = defineProps<{ genres: Genre[], selected: number[] }>()

// Each chip links to the URL with that genre toggled. Picking a genre also drops ?q= and ?page=.
function toggleLink(id: number) {
  const next = props.selected.includes(id)
    ? props.selected.filter(genreId => genreId !== id)
    : [...props.selected, id]
  return { query: next.length ? { genre: next.join(',') } : {} }
}
</script>

<template>
  <nav aria-label="Filter by genre" class="flex flex-wrap gap-2">
    <NuxtLink
      v-for="genre in genres"
      :key="genre.id"
      :to="toggleLink(genre.id)"
      :aria-current="selected.includes(genre.id) ? 'true' : undefined"
      class="rounded-full border px-3 py-1 text-sm transition"
      :class="selected.includes(genre.id)
        ? 'border-indigo-500 bg-indigo-600 text-white'
        : 'border-slate-700 text-slate-300 hover:border-slate-500'"
    >
      {{ genre.name }}
    </NuxtLink>
  </nav>
</template>
