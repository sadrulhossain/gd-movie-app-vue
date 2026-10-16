<script setup lang="ts">
import type { Review, ReviewsPage } from '#shared/types/extras'

const props = defineProps<{ movieId: number }>()

const { data, status } = useFetch<ReviewsPage>(() => `/api/movies/${props.movieId}/reviews`, {
  key: `reviews-${props.movieId}`,
  lazy: true,
  server: false
})

// Page 1 comes from useFetch; "Load more" appends further pages here.
const more = ref<Review[]>([])
const loadedPage = ref(1)
const loadingMore = ref(false)
const moreFailed = ref(false)

const reviews = computed(() => [...(data.value?.results ?? []), ...more.value])
const hasMore = computed(() => (data.value ? loadedPage.value < data.value.totalPages : false))

async function loadMore() {
  loadingMore.value = true
  moreFailed.value = false
  try {
    const next = await $fetch<ReviewsPage>(`/api/movies/${props.movieId}/reviews`, {
      query: { page: loadedPage.value + 1 }
    })
    more.value.push(...next.results)
    loadedPage.value = next.page
  } catch {
    moreFailed.value = true
  } finally {
    loadingMore.value = false
  }
}

const expanded = ref(new Set<string>())
const isLong = (review: Review) => review.content.length > 500

function toggle(id: string) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value))
</script>

<template>
  <section id="reviews" aria-labelledby="reviews-heading" class="scroll-mt-4 space-y-4">
    <h2 id="reviews-heading" class="text-xl font-bold">
      Reviews<span v-if="data?.totalResults" class="font-normal text-slate-400"> ({{ data.totalResults }})</span>
    </h2>
    <p class="text-xs text-slate-500">Written by TMDB users. They may contain spoilers.</p>

    <p v-if="!data && status !== 'error'" class="text-slate-400">Loading reviews...</p>
    <p v-else-if="!data" class="text-slate-400">Reviews could not be loaded.</p>
    <p v-else-if="!reviews.length" class="text-slate-400">No reviews yet.</p>

    <ul v-else class="space-y-4">
      <li v-for="review in reviews" :key="review.id" class="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span class="font-semibold">{{ review.author }}</span>
          <span v-if="review.rating !== null" class="font-semibold text-amber-400">★ {{ review.rating }}/10</span>
          <span class="text-slate-500">{{ formatDate(review.createdAt) }}</span>
        </div>

        <!-- Plain text only: never render review content as HTML. -->
        <p
          class="mt-2 whitespace-pre-line text-sm text-slate-200"
          :class="{ 'line-clamp-6': isLong(review) && !expanded.has(review.id) }"
        >
          {{ review.content }}
        </p>

        <div class="mt-2 flex gap-4 text-sm">
          <button
            v-if="isLong(review)"
            type="button"
            class="text-indigo-400 hover:text-indigo-300"
            :aria-expanded="expanded.has(review.id)"
            @click="toggle(review.id)"
          >
            {{ expanded.has(review.id) ? 'Show less' : 'Read more' }}
          </button>
          <a :href="review.url" target="_blank" rel="noopener" class="text-slate-400 hover:text-white">View on TMDB</a>
        </div>
      </li>
    </ul>

    <div v-if="hasMore" class="flex items-center gap-3">
      <button
        type="button"
        class="rounded bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700 disabled:opacity-50"
        :disabled="loadingMore"
        @click="loadMore"
      >
        {{ loadingMore ? 'Loading...' : 'Load more reviews' }}
      </button>
      <span v-if="moreFailed" class="text-sm text-red-400">Could not load more. Try again.</span>
    </div>
  </section>
</template>
