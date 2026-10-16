<script setup lang="ts">
import type { Review } from '#shared/types/extras'

defineProps<{ review: Review }>()

const text = useTemplateRef<HTMLElement>('text')
const expanded = ref(false)
const clamped = useIsClamped(text, expanded)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value))
</script>

<template>
  <li class="rounded-lg border border-slate-800 bg-slate-900 p-4">
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span class="font-semibold">{{ review.author }}</span>
      <span v-if="review.rating !== null" class="font-semibold text-amber-400">★ {{ review.rating }}/10</span>
      <span class="text-slate-500">{{ formatDate(review.createdAt) }}</span>
    </div>

    <!-- Plain text only: never render review content as HTML. -->
    <p
      ref="text"
      class="mt-2 whitespace-pre-line text-sm text-slate-200"
      :class="{ 'line-clamp-5': !expanded }"
    >
      {{ review.content }}
    </p>

    <div class="mt-2 flex gap-4 text-sm">
      <button
        v-if="clamped || expanded"
        type="button"
        class="text-indigo-400 hover:text-indigo-300"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Show less' : 'Read more' }}
      </button>
      <a :href="review.url" target="_blank" rel="noopener" class="text-slate-400 hover:text-white">View on TMDB</a>
    </div>
  </li>
</template>
