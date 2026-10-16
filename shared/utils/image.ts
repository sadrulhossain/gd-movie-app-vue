const IMAGE_BASE = 'https://image.tmdb.org/t/p'

/** Builds a TMDB image URL from a stored path like "/abc.jpg" (e.g. size "w500"). */
export function tmdbImageUrl(path: string | null | undefined, size: string): string | null {
  return path ? `${IMAGE_BASE}/${size}${path}` : null
}
