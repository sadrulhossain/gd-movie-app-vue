import { normalizeReviews } from '../../../utils/tmdbNormalizeExtras'
import type { TmdbReviews } from '../../../utils/tmdbNormalizeExtras'

export default defineCachedEventHandler(async (event) => {
  const id = parseId(event)
  const data = await tmdbFetch<TmdbReviews>(event, `/movie/${id}/reviews`, {
    page: parsePage(getQuery(event).page)
  })
  return normalizeReviews(data)
}, { maxAge: 60 * 60 })
