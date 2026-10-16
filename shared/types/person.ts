import type { MovieSummary } from './movie'

export interface PersonDetails {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  placeOfBirth: string | null
  knownForDepartment: string
  profileUrl: string | null
  knownFor: MovieSummary[]
}
