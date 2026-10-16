// Normalized shapes returned by our /api/movies routes (not TMDB's raw shapes).
export interface MovieSummary {
  id: number
  title: string
  overview: string
  releaseDate: string | null
  posterPath: string | null
  posterUrl: string | null
  backdropUrl: string | null
  rating: number
}

export interface Paginated<T> {
  page: number
  totalPages: number
  totalResults: number
  results: T[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profileUrl: string | null
}

export interface Trailer {
  name: string
  youtubeKey: string
  url: string
}

export interface MovieDetails extends MovieSummary {
  tagline: string
  runtime: number | null
  genres: string[]
  cast: CastMember[]
  trailer: Trailer | null
}
