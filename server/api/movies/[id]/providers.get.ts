import type { H3Event } from 'h3'
import { normalizeProviders, type TmdbProviders } from '../../../utils/tmdbNormalize'

const DEFAULT_REGION = 'US'

/** ?region=XX if given, else the visitor's country from Cloudflare, else the default. */
function resolveRegion(event: H3Event): string {
  const requested = getQuery(event).region
  if (requested !== undefined && requested !== '') {
    if (typeof requested !== 'string' || !/^[A-Za-z]{2}$/.test(requested)) {
      throw createError({ statusCode: 400, statusMessage: 'region must be a 2-letter country code' })
    }
    return requested.toUpperCase()
  }

  // Cloudflare adds this header; it is absent locally. "XX" (unknown) and "T1" (Tor) are not countries.
  const detected = getRequestHeader(event, 'cf-ipcountry')?.toUpperCase()
  return detected && /^[A-Z]{2}$/.test(detected) && detected !== 'XX' ? detected : DEFAULT_REGION
}

export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^\d+$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'id must be a number' })
  }

  const region = resolveRegion(event)
  const data = await tmdbFetch<TmdbProviders>(event, `/movie/${id}/watch/providers`)
  return normalizeProviders(data, region)
}, {
  maxAge: 60 * 60 * 6,
  // The answer depends on the visitor's country when no ?region= is given, so cache per country.
  varies: ['cf-ipcountry']
})
