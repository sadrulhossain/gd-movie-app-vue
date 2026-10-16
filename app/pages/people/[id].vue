<script setup lang="ts">
import type { PersonDetails } from '#shared/types/person'

const route = useRoute()
const id = String(route.params.id)

const { data: person, error, refresh } = await useFetch<PersonDetails>(`/api/people/${id}`, {
  key: `person-${id}`
})

// Bad id (400) or unknown person (404): show Nuxt's 404 page. Other errors render inline below.
if (error.value && [400, 404].includes(error.value.statusCode ?? 0)) {
  throw createError({ statusCode: 404, statusMessage: 'Person not found', fatal: true })
}

// Fixed locale and UTC so the server and the browser render the same text.
const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value))

const facts = computed(() => {
  const p = person.value
  if (!p) return []
  return [
    p.knownForDepartment && { label: 'Known for', value: p.knownForDepartment },
    p.birthday && { label: 'Born', value: formatDate(p.birthday) },
    p.deathday && { label: 'Died', value: formatDate(p.deathday) },
    p.placeOfBirth && { label: 'Place of birth', value: p.placeOfBirth }
  ].filter((fact): fact is { label: string, value: string } => Boolean(fact))
})

const bio = useTemplateRef<HTMLElement>('bio')
const expanded = ref(false)
const clamped = useIsClamped(bio, expanded)

useSeoMeta({
  title: () => person.value?.name,
  description: () => person.value?.biography.slice(0, 160) || undefined,
  ogTitle: () => person.value?.name,
  ogDescription: () => person.value?.biography.slice(0, 160) || undefined,
  ogImage: () => person.value?.profileUrl ?? undefined
})
</script>

<template>
  <div v-if="error" class="space-y-3 rounded-lg border border-red-900 bg-red-950/40 p-4">
    <p>{{ error.statusMessage || 'Something went wrong.' }}</p>
    <button type="button" class="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700" @click="refresh()">
      Try again
    </button>
  </div>

  <article v-else-if="person" class="space-y-8">
    <BackLink />

    <div class="flex flex-col gap-6 sm:flex-row">
      <div class="mx-auto w-48 shrink-0 sm:mx-0 sm:w-56">
        <img
          v-if="person.profileUrl"
          :src="person.profileUrl"
          :alt="person.name"
          fetchpriority="high"
          class="aspect-[2/3] w-full rounded-lg object-cover shadow-lg"
        >
        <div v-else class="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-slate-800 text-sm text-slate-500">
          No photo
        </div>
      </div>

      <div class="space-y-4">
        <h1 class="text-3xl font-bold">{{ person.name }}</h1>

        <dl v-if="facts.length" class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <template v-for="fact in facts" :key="fact.label">
            <dt class="text-slate-400">{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </template>
        </dl>

        <div>
          <h2 class="mb-1 font-semibold">Biography</h2>
          <p v-if="person.biography" ref="bio" class="max-w-prose whitespace-pre-line text-slate-200" :class="{ 'line-clamp-6': !expanded }">
            {{ person.biography }}
          </p>
          <p v-else class="text-slate-400">No biography available.</p>
          <button
            v-if="clamped || expanded"
            type="button"
            class="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
          >
            {{ expanded ? 'Show less' : 'Read more' }}
          </button>
        </div>
      </div>
    </div>

    <section v-if="person.knownFor.length" aria-labelledby="known-for-heading">
      <h2 id="known-for-heading" class="mb-4 text-xl font-bold">Known for</h2>
      <AppSlider label="known for movies">
        <li v-for="movie in person.knownFor" :key="movie.id" class="w-40 shrink-0 snap-start sm:w-44">
          <MovieCard :movie="movie" />
        </li>
      </AppSlider>
    </section>
  </article>
</template>
