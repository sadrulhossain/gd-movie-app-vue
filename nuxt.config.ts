import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
const usePolling = process.env.CHOKIDAR_USEPOLLING === 'true'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  // Private (server-only) values. NUXT_TMDB_API_KEY in .env overrides tmdbApiKey.
  // Only keys under `public` are ever sent to the browser.
  runtimeConfig: {
    tmdbApiKey: '',
    tmdbBaseUrl: 'https://api.themoviedb.org/3'
  },
  // Hot reload inside Docker on a bind mount needs polling (set in docker-compose.yml)
  watchers: { chokidar: { usePolling, interval: 300 } },
  vite: {
    plugins: [tailwindcss()],
    server: { watch: { usePolling, interval: 300 } }
  }
})
