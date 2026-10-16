<script setup lang="ts">
const links = [
  { to: '/', label: 'Home' },
  { to: '/watchlist', label: 'Watchlist' }
]

const open = ref(false)

const { theme, sync, toggle } = useTheme()

// A shadow appears once the page has scrolled under the bar.
const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 4
}

onMounted(() => {
  sync()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-950 text-slate-100">
    <!-- Sticky glass bar: always translucent and frosted, so scrolling content shows through it. -->
    <header
      class="sticky top-0 z-40 border-b border-slate-100/10 bg-slate-950/60 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300"
      :class="scrolled ? 'shadow-lg shadow-black/30' : 'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08)]'"
    >
      <!-- Soft highlight along the top edge gives the glossy sheen. -->
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" aria-hidden="true" />
      <nav class="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2 text-lg font-bold">
          <img src="~/assets/img/logo.svg" alt="" class="h-8 w-8">
          GD Movies
        </NuxtLink>

        <div class="flex items-center gap-1 sm:gap-6">
          <ul
            class="absolute inset-x-0 top-14 flex-col gap-1 border-b border-slate-800 bg-slate-950 p-4 sm:static sm:flex sm:flex-row sm:gap-6 sm:border-0 sm:p-0"
            :class="open ? 'flex' : 'hidden'"
          >
            <li v-for="link in links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="block py-1 text-slate-400 hover:text-slate-100"
                active-class="text-slate-100"
                @click="open = false"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
          <button
            type="button"
            class="rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggle"
          >
            <svg v-if="theme === 'dark'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          </button>
          <button
            type="button"
            class="rounded p-2 hover:bg-slate-800 sm:hidden"
            :aria-expanded="open"
            aria-label="Toggle menu"
            @click="open = !open"
          >
            ☰
          </button>
        </div>
      </nav>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
      <slot />
    </main>

    <footer class="border-t border-slate-800">
      <p class="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-400">
        This product uses the TMDB API but is not endorsed or certified by
        <a href="https://www.themoviedb.org" target="_blank" rel="noopener" class="underline hover:text-slate-100">TMDB</a>.
      </p>
    </footer>
  </div>
</template>
