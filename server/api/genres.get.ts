import type { Genre } from '#shared/types/movie'

// The genre list almost never changes: cache it for a day.
export default defineCachedEventHandler(async (event) => {
  const data = await tmdbFetch<{ genres: Genre[] }>(event, '/genre/movie/list')
  return data.genres
}, { maxAge: 60 * 60 * 24 })
