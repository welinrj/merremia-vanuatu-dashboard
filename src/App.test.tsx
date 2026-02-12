import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders sidebar with project name and page switcher', () => {
    render(<App />)
    expect(screen.getByText('VCAP2')).toBeInTheDocument()
    expect(screen.getByText('Staff')).toBeInTheDocument()
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('shows overview by default on staff page', () => {
    render(<App />)
    expect(screen.getAllByText('Overview').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Total Surveys')).toBeInTheDocument()
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

  it('renders header with section title', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('switches to public page and shows datasets', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Public' }))
    expect(screen.getByRole('button', { name: 'Datasets' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument()
  })

  it('switches to public page and shows about section', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Public' }))
    fireEvent.click(screen.getByRole('button', { name: 'About' }))
    expect(screen.getByText('VCAP2 Public Data Portal')).toBeInTheDocument()
  })

  it('switches back to staff page from public', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Public' }))
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    expect(screen.getByText('Total Surveys')).toBeInTheDocument()
  })
})
