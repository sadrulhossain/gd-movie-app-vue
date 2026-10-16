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
  // Deploy target: Cloudflare Workers (needs a server runtime for /api routes; GitHub Pages can't).
  // The preset only affects `nuxt build`; `nuxt dev` in Docker is unchanged.
  nitro: {
    preset: 'cloudflare_module',
    cloudflare: { deployConfig: true, nodeCompat: true }
  },
  watchers: { chokidar: { usePolling, interval: 300 } },
  vite: {
    plugins: [tailwindcss()],
    server: { watch: { usePolling, interval: 300 } }
  }
})
