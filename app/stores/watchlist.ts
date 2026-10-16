import type { WatchlistItem, WatchStatus } from '#shared/types/watchlist'

const STORAGE_KEY = 'movie-app:watchlist:v1'

type MovieRef = Pick<WatchlistItem, 'id' | 'title' | 'posterPath'>

function isItem(value: unknown): value is WatchlistItem {
  const item = value as WatchlistItem
  return typeof item?.id === 'number'
    && typeof item.title === 'string'
    && (item.posterPath === null || typeof item.posterPath === 'string')
    && (item.status === 'want' || item.status === 'watched')
}

export const useWatchlistStore = defineStore('watchlist', () => {
  // Starts empty on server and client so the first render matches; load() fills it after mount.
  const items = ref<WatchlistItem[]>([])
  const ready = ref(false)

  function statusOf(id: number): WatchStatus | null {
    return items.value.find(item => item.id === id)?.status ?? null
  }

  function set(movie: MovieRef, status: WatchStatus) {
    const next: WatchlistItem = { id: movie.id, title: movie.title, posterPath: movie.posterPath, status }
    const index = items.value.findIndex(item => item.id === movie.id)
    if (index === -1) items.value.unshift(next) // newest first
    else items.value[index] = next
  }

  function remove(id: number) {
    items.value = items.value.filter(item => item.id !== id)
  }

  /** Clicking the active status removes the movie; otherwise sets (or switches) it. */
  function toggle(movie: MovieRef, status: WatchStatus) {
    if (statusOf(movie.id) === status) remove(movie.id)
    else set(movie, status)
  }

  // Browser-only: call from onMounted or an app:mounted hook, never during setup.
  function load() {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      items.value = Array.isArray(parsed) ? parsed.filter(isItem) : []
    } catch {
      items.value = [] // corrupted or blocked storage: start fresh
    }
    ready.value = true
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch {
      // Quota exceeded or storage unavailable (private mode): keep working in memory
    }
  }

  return { items, ready, statusOf, set, remove, toggle, load, save }
})
