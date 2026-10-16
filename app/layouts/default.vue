<script setup lang="ts">
const links = [
  { to: '/', label: 'Home' },
  { to: '/watchlist', label: 'Watchlist' }
]

const open = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="border-b border-slate-800">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="text-lg font-bold">Movie App</NuxtLink>

        <button
          type="button"
          class="rounded p-2 hover:bg-slate-800 sm:hidden"
          :aria-expanded="open"
          aria-label="Toggle menu"
          @click="open = !open"
        >
          ☰
        </button>

        <ul
          class="absolute inset-x-0 top-14 flex-col gap-1 border-b border-slate-800 bg-slate-950 p-4 sm:static sm:flex sm:flex-row sm:gap-6 sm:border-0 sm:p-0"
          :class="open ? 'flex' : 'hidden'"
        >
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="block py-1 text-slate-400 hover:text-white"
              active-class="text-white"
              @click="open = false"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
