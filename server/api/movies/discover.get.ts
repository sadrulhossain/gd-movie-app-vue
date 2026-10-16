import { normalizeList, type TmdbList } from '../../utils/tmdbNormalize'

const MAX_GENRES = 5

export default defineCachedEventHandler(async (event) => {
  const { genre, page } = getQuery(event)

  // ?genre=28,12 means Action AND Adventure. Sorted and de-duplicated so equal filters share a cache entry.
  const raw = String(genre ?? '')
  if (raw && !/^\d+(,\d+)*$/.test(raw)) {
    throw createError({ statusCode: 400, statusMessage: 'genre must be comma-separated numeric ids' })
  }
  const ids = [...new Set(raw ? raw.split(',').map(Number) : [])].sort((a, b) => a - b)
  if (ids.length > MAX_GENRES) {
    throw createError({ statusCode: 400, statusMessage: `at most ${MAX_GENRES} genres` })
  }

  const data = await tmdbFetch<TmdbList>(event, '/discover/movie', {
    with_genres: ids.join(',') || undefined,
    page: parsePage(page),
    sort_by: 'popularity.desc',
    include_adult: 'false'
  })
  return normalizeList(data)
}, { maxAge: 60 * 60 })
