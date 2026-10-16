export interface WatchProvider {
  id: number
  name: string
  logoUrl: string | null
}

// Where one movie can be watched in one country. Data comes from TMDB (originally JustWatch).
export interface WatchProviders {
  region: string // ISO 3166-1 code actually used, e.g. "US"
  regions: string[] // every country that has data for this movie
  link: string | null // TMDB's watch page for this movie and country
  flatrate: WatchProvider[] // subscription
  rent: WatchProvider[]
  buy: WatchProvider[]
  ads: WatchProvider[] // free with ads
}
