export interface Review {
  id: string
  author: string
  rating: number | null // the reviewer's own score out of 10, when they gave one
  content: string
  createdAt: string
  url: string
}

export interface ReviewsPage {
  page: number
  totalPages: number
  totalResults: number
  results: Review[]
}

export interface MediaImage {
  thumbUrl: string
  fullUrl: string
  width: number
  height: number
}

export interface MediaVideo {
  name: string
  type: string // Trailer, Teaser, Clip, Featurette, Behind the Scenes, ...
  youtubeKey: string
  url: string
  thumbUrl: string
}

export interface MovieMedia {
  videos: MediaVideo[]
  backdrops: MediaImage[]
  posters: MediaImage[]
}
