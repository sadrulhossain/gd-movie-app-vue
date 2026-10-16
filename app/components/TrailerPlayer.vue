<script setup lang="ts">
import type { Trailer } from '#shared/types/movie'

const props = defineProps<{ trailer: Trailer }>()

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const open = ref(false)

// The iframe only exists while open: nothing loads from YouTube until the click,
// and closing removes it, which stops the video.
const embedUrl = computed(
  () => `https://www.youtube-nocookie.com/embed/${props.trailer.youtubeKey}?autoplay=1&rel=0`
)

function show() {
  open.value = true
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close() // fires the native "close" event, which resets `open`
}

// The dialog has no padding, so a click whose target is the dialog itself hit the backdrop.
function onClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <button
    type="button"
    class="inline-block rounded bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500"
    @click="show"
  >
    ▶ Watch trailer
  </button>

  <dialog
    ref="dialog"
    class="m-auto w-full max-w-4xl rounded-xl bg-slate-900 p-0 text-slate-100 backdrop:bg-black/80"
    aria-label="Trailer"
    @close="open = false"
    @click="onClick"
  >
    <div class="space-y-3 p-3 sm:p-4">
      <div class="flex items-center justify-between gap-4">
        <h2 class="truncate font-semibold">{{ trailer.name }}</h2>
        <button
          type="button"
          class="rounded px-2 py-1 hover:bg-slate-800"
          aria-label="Close trailer"
          @click="close"
        >
          ✕
        </button>
      </div>

      <div class="aspect-video overflow-hidden rounded bg-black">
        <iframe
          v-if="open"
          :src="embedUrl"
          :title="`${trailer.name} (YouTube video player)`"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
          class="h-full w-full"
        />
      </div>

      <p class="text-sm text-slate-400">
        Video not playing?
        <a :href="trailer.url" target="_blank" rel="noopener" class="underline hover:text-white">Open it on YouTube</a>.
      </p>
    </div>
  </dialog>
</template>
