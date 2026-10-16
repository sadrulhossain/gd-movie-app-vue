<script setup lang="ts">
// Goes back to wherever the visitor came from inside the app (for example movie -> cast -> back to
// the movie). With no in-app history (a direct visit), it is a normal link to the home page.
const router = useRouter()

function onClick(event: MouseEvent) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return // let new-tab clicks through
  if (window.history.state?.back) {
    event.preventDefault()
    router.back()
  }
}
</script>

<template>
  <NuxtLink
    to="/"
    class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-500"
    @click="onClick"
  >
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 4 6 10l6 6" />
    </svg>
    Back
  </NuxtLink>
</template>
