import type { SightingRecord, StatCardData, LocationSummary } from '../types/dashboard'

export const stats: StatCardData[] = [
  { title: 'Total Sightings', value: 1284, change: 12.5 },
  { title: 'Species Recorded', value: 23, change: 4.3 },
  { title: 'Active Locations', value: 8, change: 0 },
  { title: 'Observers', value: 15, change: -2.1 },
]

export const recentSightings: SightingRecord[] = [
  {
    id: '1',
    date: '2026-02-07',
    location: 'Efate Island',
    species: 'Merremia peltata',
    count: 45,
    observer: 'Dr. Tari',
    notes: 'Dense growth along coastal road',
  },
  {
    id: '2',
    date: '2026-02-06',
    location: 'Tanna Island',
    species: 'Merremia peltata',
    count: 23,
    observer: 'M. Kalsakau',
  },
  {
    id: '3',
    date: '2026-02-05',
    location: 'Santo Island',
    species: 'Merremia gemella',
    count: 12,
    observer: 'Dr. Tari',
    notes: 'New growth near river crossing',
  },
  {
    id: '4',
    date: '2026-02-04',
    location: 'Malekula Island',
    species: 'Merremia peltata',
    count: 67,
    observer: 'J. Naupa',
  },
  {
    id: '5',
    date: '2026-02-03',
    location: 'Efate Island',
    species: 'Merremia vitifolia',
    count: 8,
    observer: 'S. Vatu',
    notes: 'Small patch near plantation edge',
  },
]

export const locationSummaries: LocationSummary[] = [
  { name: 'Efate Island', totalSightings: 412, speciesCount: 8 },
  { name: 'Tanna Island', totalSightings: 287, speciesCount: 5 },
  { name: 'Santo Island', totalSightings: 234, speciesCount: 7 },
  { name: 'Malekula Island', totalSightings: 198, speciesCount: 4 },
  { name: 'Ambrym Island', totalSightings: 89, speciesCount: 3 },
  { name: 'Pentecost Island', totalSightings: 64, speciesCount: 2 },
]
