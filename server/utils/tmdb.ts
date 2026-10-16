import type { H3Event } from 'h3'

const MAX_PAGE = 500 // TMDB does not serve pages beyond 500

type Query = Record<string, string | number | undefined>

/** Calls TMDB with the server-side key. Errors are mapped so the key can never leak. */
export async function tmdbFetch<T>(event: H3Event, path: string, query: Query = {}): Promise<T> {
  const { tmdbApiKey, tmdbBaseUrl } = useRuntimeConfig(event)

  if (!tmdbApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'TMDB API key is not configured' })
  }

  // The "API Read Access Token" is a JWT (sent as Bearer); the v3 "API Key" goes in the query.
  const isToken = tmdbApiKey.startsWith('eyJ')

  try {
    return await $fetch<T>(path, {
      baseURL: tmdbBaseUrl,
      query: { language: 'en-US', ...query, ...(isToken ? {} : { api_key: tmdbApiKey }) },
      headers: isToken ? { Authorization: `Bearer ${tmdbApiKey}` } : undefined,
      timeout: 8000
    })
  } catch (error) {
    // Never forward error.message: FetchError messages contain the full URL, including api_key.
    const status = (error as { statusCode?: number }).statusCode
    console.error(`[tmdb] ${path} failed with status ${status ?? 'network error'}`)

    if (status === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Not found' })
    }
    if (status === 429) {
      throw createError({ statusCode: 429, statusMessage: 'TMDB rate limit reached, try again shortly' })
    }
    if (status === 401) {
      throw createError({ statusCode: 502, statusMessage: 'TMDB rejected the configured API key' })
    }
    throw createError({ statusCode: 502, statusMessage: 'TMDB request failed' })
  }
}

/** Parses an optional ?page= value (1..500). Missing means page 1. */
export function parsePage(value: unknown): number {
  if (value === undefined || value === '') return 1
  const page = Number(value)
  if (!Number.isInteger(page) || page < 1 || page > MAX_PAGE) {
    throw createError({ statusCode: 400, statusMessage: `page must be an integer between 1 and ${MAX_PAGE}` })
  }
  return page
}
