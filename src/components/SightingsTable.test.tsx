import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SightingsTable from './SightingsTable'
import type { SightingRecord } from '../types/dashboard'

const mockSightings: SightingRecord[] = [
  {
    id: '1',
    date: '2026-02-07',
    location: 'Efate Island',
    species: 'Acropora millepora',
    count: 45,
    observer: 'Dr. Tari',
  },
  {
    id: '2',
    date: '2026-02-06',
    location: 'Tanna Island',
    species: 'Chelonia mydas',
    count: 12,
    observer: 'M. Kalsakau',
  },
]

describe('SightingsTable', () => {
  it('renders table headers', () => {
    render(<SightingsTable sightings={mockSightings} />)
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Species')).toBeInTheDocument()
    expect(screen.getByText('Count')).toBeInTheDocument()
    expect(screen.getByText('Observer')).toBeInTheDocument()
  })

  it('renders sighting data', () => {
    render(<SightingsTable sightings={mockSightings} />)
    expect(screen.getByText('Efate Island')).toBeInTheDocument()
    expect(screen.getByText('Acropora millepora')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('Dr. Tari')).toBeInTheDocument()
  })

  it('renders all rows', () => {
    render(<SightingsTable sightings={mockSightings} />)
    const rows = screen.getAllByRole('row')
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3)
  })

  it('renders heading', () => {
    render(<SightingsTable sightings={mockSightings} />)
    expect(screen.getByText('Recent Sightings')).toBeInTheDocument()
  })
})
