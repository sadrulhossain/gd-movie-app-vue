import { normalizeList, type TmdbList } from '../../../utils/tmdbNormalize'

const MAX_RECOMMENDATIONS = 12

export default defineCachedEventHandler(async (event) => {
  const id = parseId(event)
  const data = await tmdbFetch<TmdbList>(event, `/movie/${id}/recommendations`)
  return normalizeList(data).results.slice(0, MAX_RECOMMENDATIONS)
}, { maxAge: 60 * 60 })
