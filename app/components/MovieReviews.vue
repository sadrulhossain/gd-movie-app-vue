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
      <ReviewItem v-for="review in reviews" :key="review.id" :review="review" />
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
