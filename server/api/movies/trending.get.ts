import { normalizeList, type TmdbList } from '../../utils/tmdbNormalize'

export default defineCachedEventHandler(async (event) => {
  const data = await tmdbFetch<TmdbList>(event, '/trending/movie/week', {
    page: parsePage(getQuery(event).page)
  })
  return normalizeList(data)
}, { maxAge: 60 * 60 })
