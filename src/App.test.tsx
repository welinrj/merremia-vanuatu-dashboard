import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders sidebar with project name', () => {
    render(<App />)
    expect(screen.getByText('Merremia')).toBeInTheDocument()
    expect(screen.getByText('Vanuatu Dashboard')).toBeInTheDocument()
  })

  it('shows overview by default', () => {
    render(<App />)
    expect(screen.getAllByText('Overview').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Total Sightings')).toBeInTheDocument()
  })

  it('navigates to data portal section', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Data Portal' }))
    expect(screen.getByText('GIS Data Portal')).toBeInTheDocument()
  })

  it('navigates to sightings section', () => {
    render(<App />)
    const sightingsButtons = screen.getAllByText('Sightings')
    // Click the nav button (first one)
    fireEvent.click(sightingsButtons[0])
    expect(screen.getByText('Recent Sightings')).toBeInTheDocument()
  })

  it('navigates to locations section', () => {
    render(<App />)
    const locationsButtons = screen.getAllByText('Locations')
    fireEvent.click(locationsButtons[0])
    expect(screen.getByText('Efate Island')).toBeInTheDocument()
  })

  it('shows placeholder for species section', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Species' }))
    expect(screen.getByText('Species catalog coming soon.')).toBeInTheDocument()
  })

  it('shows placeholder for settings section', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
    expect(screen.getByText('Settings page coming soon.')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })
})
