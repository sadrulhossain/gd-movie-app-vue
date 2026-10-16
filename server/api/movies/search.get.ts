import { normalizeList, type TmdbList } from '../../utils/tmdbNormalize'

export default defineCachedEventHandler(async (event) => {
  const { query, page } = getQuery(event)

  const text = String(query ?? '').trim()
  if (!text || text.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'query is required (max 100 characters)' })
  }

  const data = await tmdbFetch<TmdbList>(event, '/search/movie', {
    query: text,
    page: parsePage(page),
    include_adult: 'false'
  })
  return normalizeList(data)
}, { maxAge: 60 * 5 }) // default cache key includes the query string
