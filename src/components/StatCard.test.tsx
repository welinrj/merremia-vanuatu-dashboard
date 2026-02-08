import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCard from './StatCard'
import type { StatCardData } from '../types/dashboard'

describe('StatCard', () => {
  it('renders title and value', () => {
    const data: StatCardData = { title: 'Total Sightings', value: 42 }
    render(<StatCard data={data} />)
    expect(screen.getByText('Total Sightings')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders positive change with + prefix', () => {
    const data: StatCardData = { title: 'Count', value: 10, change: 5.2 }
    render(<StatCard data={data} />)
    expect(screen.getByText('+5.2%')).toBeInTheDocument()
    expect(screen.getByText('+5.2%')).toHaveClass('positive')
  })

  it('renders negative change', () => {
    const data: StatCardData = { title: 'Count', value: 10, change: -3.1 }
    render(<StatCard data={data} />)
    expect(screen.getByText('-3.1%')).toBeInTheDocument()
    expect(screen.getByText('-3.1%')).toHaveClass('negative')
  })

  it('renders neutral change for zero', () => {
    const data: StatCardData = { title: 'Count', value: 10, change: 0 }
    render(<StatCard data={data} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('0%')).toHaveClass('neutral')
  })

  it('renders unit when provided', () => {
    const data: StatCardData = { title: 'Area', value: 250, unit: 'ha' }
    render(<StatCard data={data} />)
    expect(screen.getByText('ha')).toBeInTheDocument()
  })
})
