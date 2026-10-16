<script setup lang="ts">
const counter = useCounterStore()
</script>

<template>
  <section class="space-y-3">
    <h1 class="text-2xl font-bold">Home</h1>
    <p class="text-slate-400">Store initialized on: {{ counter.initializedOn }}</p>
    <button
      type="button"
      class="rounded bg-indigo-600 px-4 py-2 hover:bg-indigo-500"
      @click="counter.increment()"
    >
      Count: {{ counter.count }}
    </button>
  </section>
</template>
