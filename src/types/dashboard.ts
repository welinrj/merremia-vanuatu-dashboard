export interface StatCardData {
  title: string
  value: string | number
  unit?: string
  change?: number
}

export interface SightingRecord {
  id: string
  date: string
  location: string
  species: string
  count: number
  observer: string
  notes?: string
}

export interface LocationSummary {
  name: string
  totalSightings: number
  speciesCount: number
}
