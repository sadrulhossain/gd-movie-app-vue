import { tmdbImageUrl } from '#shared/utils/image'
import type { PersonDetails } from '#shared/types/person'
import type { CastMember, MovieDetails, MovieSummary, Paginated, Trailer } from '#shared/types/movie'

const MAX_CAST = 12
const MAX_KNOWN_FOR = 20

// Only the TMDB fields we read.
interface TmdbMovie {
  id: number
  title: string
  overview: string
  release_date?: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  popularity?: number
}

export interface TmdbList {
  page: number
  total_pages: number
  total_results: number
  results: TmdbMovie[]
}

export interface TmdbDetails extends TmdbMovie {
  tagline?: string
  runtime: number | null
  genres: { name: string }[]
  credits?: { cast: { id: number, name: string, character: string, profile_path: string | null }[] }
  videos?: { results: { name: string, site: string, type: string, key: string, official: boolean }[] }
}

export function normalizeMovie(movie: TmdbMovie): MovieSummary {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    releaseDate: movie.release_date || null, // TMDB uses '' when unknown
    posterPath: movie.poster_path,
    posterUrl: tmdbImageUrl(movie.poster_path, 'w500'),
    backdropUrl: tmdbImageUrl(movie.backdrop_path, 'w780'),
    rating: Math.round(movie.vote_average * 10) / 10
  }
}

export function normalizeList(list: TmdbList): Paginated<MovieSummary> {
  return {
    page: list.page,
    totalPages: list.total_pages,
    totalResults: list.total_results,
    results: list.results.map(normalizeMovie)
  }
}

function pickTrailer(videos: TmdbDetails['videos']): Trailer | null {
  // Only well-formed 11-character YouTube ids may reach an iframe URL.
  const youtube = (videos?.results ?? []).filter(
    v => v.site === 'YouTube' && v.type === 'Trailer' && /^[\w-]{11}$/.test(v.key)
  )
  const video = youtube.find(v => v.official) ?? youtube[0]
  return video
    ? { name: video.name, youtubeKey: video.key, url: `https://www.youtube.com/watch?v=${video.key}` }
    : null
}

export function normalizeDetails(movie: TmdbDetails): MovieDetails {
  const cast: CastMember[] = (movie.credits?.cast ?? []).slice(0, MAX_CAST).map(person => ({
    id: person.id,
    name: person.name,
    character: person.character,
    profileUrl: tmdbImageUrl(person.profile_path, 'w185')
  }))

  return {
    ...normalizeMovie(movie),
    tagline: movie.tagline ?? '',
    runtime: movie.runtime || null,
    genres: movie.genres.map(genre => genre.name),
    cast,
    trailer: pickTrailer(movie.videos)
  }
}

export interface TmdbPerson {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
  movie_credits?: { cast: TmdbMovie[], crew: TmdbMovie[] }
}

export function normalizePerson(person: TmdbPerson): PersonDetails {
  const credits = person.movie_credits
  // Actors are known for what they appeared in; everyone else (directors, writers) for crew credits.
  const preferred = person.known_for_department === 'Acting' ? credits?.cast : credits?.crew
  const source = preferred?.length ? preferred : (credits?.cast ?? [])
  const unique = [...new Map(source.map(movie => [movie.id, movie])).values()]

  return {
    id: person.id,
    name: person.name,
    biography: person.biography,
    birthday: person.birthday,
    deathday: person.deathday,
    placeOfBirth: person.place_of_birth,
    knownForDepartment: person.known_for_department,
    profileUrl: tmdbImageUrl(person.profile_path, 'h632'),
    knownFor: unique
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, MAX_KNOWN_FOR)
      .map(normalizeMovie)
  }
}
