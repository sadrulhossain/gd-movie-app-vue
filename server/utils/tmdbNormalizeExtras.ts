import { tmdbImageUrl } from '#shared/utils/image'
import type { MediaImage, MediaVideo, MovieMedia, Review, ReviewsPage } from '#shared/types/extras'

const MAX_REVIEW_LENGTH = 4000 // reviews can be enormous; keep the payload bounded
const MAX_IMAGES = 12
const MAX_VIDEOS = 12
const VIDEO_ORDER = ['Trailer', 'Teaser', 'Clip', 'Featurette', 'Behind the Scenes', 'Bloopers']

export interface TmdbReviews {
  page: number
  total_pages: number
  total_results: number
  results: {
    id: string
    author: string
    author_details?: { rating?: number | null }
    content: string
    created_at: string
    url: string
  }[]
}

interface TmdbImage {
  file_path: string
  width: number
  height: number
}

export interface TmdbImages {
  backdrops?: TmdbImage[]
  posters?: TmdbImage[]
}

export interface TmdbVideos {
  results?: { name: string, site: string, type: string, key: string }[]
}

function normalizeReview(review: TmdbReviews['results'][number]): Review {
  const content = review.content.replace(/\r\n?/g, '\n').trim()
  return {
    id: review.id,
    author: review.author,
    rating: review.author_details?.rating ?? null,
    content: content.length > MAX_REVIEW_LENGTH ? `${content.slice(0, MAX_REVIEW_LENGTH)}…` : content,
    createdAt: review.created_at,
    url: review.url
  }
}

export function normalizeReviews(data: TmdbReviews): ReviewsPage {
  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map(normalizeReview)
  }
}

const images = (list: TmdbImage[] | undefined, thumb: string, full: string): MediaImage[] =>
  (list ?? []).slice(0, MAX_IMAGES).map(image => ({
    thumbUrl: tmdbImageUrl(image.file_path, thumb)!,
    fullUrl: tmdbImageUrl(image.file_path, full)!,
    width: image.width,
    height: image.height
  }))

export function normalizeMedia(imageData: TmdbImages, videoData: TmdbVideos): MovieMedia {
  const rank = (type: string) => {
    const index = VIDEO_ORDER.indexOf(type)
    return index === -1 ? VIDEO_ORDER.length : index
  }

  const videos: MediaVideo[] = (videoData.results ?? [])
    .filter(video => video.site === 'YouTube' && /^[\w-]{11}$/.test(video.key)) // same id check as trailers
    .sort((a, b) => rank(a.type) - rank(b.type))
    .slice(0, MAX_VIDEOS)
    .map(video => ({
      name: video.name,
      type: video.type,
      youtubeKey: video.key,
      url: `https://www.youtube.com/watch?v=${video.key}`,
      thumbUrl: `https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`
    }))

  return {
    videos,
    backdrops: images(imageData.backdrops, 'w780', 'w1280'),
    posters: images(imageData.posters, 'w342', 'w780')
  }
}
