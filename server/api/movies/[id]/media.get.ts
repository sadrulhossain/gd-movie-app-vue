import { normalizeMedia } from '../../../utils/tmdbNormalizeExtras'
import type { TmdbImages, TmdbVideos } from '../../../utils/tmdbNormalizeExtras'

export default defineCachedEventHandler(async (event) => {
  const id = parseId(event)

  // Images in English plus language-neutral ones (no text on the poster); videos in parallel.
  const [images, videos] = await Promise.all([
    tmdbFetch<TmdbImages>(event, `/movie/${id}/images`, { include_image_language: 'en,null' }),
    tmdbFetch<TmdbVideos>(event, `/movie/${id}/videos`)
  ])
  return normalizeMedia(images, videos)
}, { maxAge: 60 * 60 })
