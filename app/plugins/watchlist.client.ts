// Client-only. Waiting for app:mounted keeps hydration identical to the server HTML,
// then the saved watchlist loads and every later change is written back.
export default defineNuxtPlugin((nuxtApp) => {
  const watchlist = useWatchlistStore()

  nuxtApp.hook('app:mounted', () => {
    watchlist.load()
    watchlist.$subscribe(() => watchlist.save())
  })
})
