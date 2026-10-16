import { normalizeDetails, type TmdbDetails } from '../../utils/tmdbNormalize'

export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^\d+$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'id must be a number' })
  }

  // One upstream call returns details, credits and videos together.
  const data = await tmdbFetch<TmdbDetails>(event, `/movie/${id}`, {
    append_to_response: 'credits,videos'
  })
  return normalizeDetails(data)
}, { maxAge: 60 * 60 })
