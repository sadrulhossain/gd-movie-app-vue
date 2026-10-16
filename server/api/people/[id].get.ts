import { normalizePerson, type TmdbPerson } from '../../utils/tmdbNormalize'

export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^\d+$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'id must be a number' })
  }

  // One upstream call returns the person and their movie credits.
  const data = await tmdbFetch<TmdbPerson>(event, `/person/${id}`, {
    append_to_response: 'movie_credits'
  })
  return normalizePerson(data)
}, { maxAge: 60 * 60 })
