export type WatchStatus = 'want' | 'watched'

// Only what the watchlist needs to render a card; everything else is refetched on demand.
export interface WatchlistItem {
  id: number
  title: string
  posterPath: string | null
  status: WatchStatus
}
