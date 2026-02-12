import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders sidebar with project name and page switcher', () => {
    render(<App />)
    expect(screen.getByText('VCAP2')).toBeInTheDocument()
    expect(screen.getByText('Staff')).toBeInTheDocument()
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('defaults to public page with datasets', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Datasets' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument()
  })

  it('shows login form when clicking Staff without auth', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    expect(screen.getByText('Staff Login')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('shows error for wrong password', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Incorrect password')
  })

  it('grants access with correct password', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'VC@P 2026' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))
    expect(screen.getByText('Total Surveys')).toBeInTheDocument()
  })

  it('returns to public page when cancelling login', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    fireEvent.click(screen.getByRole('button', { name: 'Back to Public' }))
    expect(screen.getByRole('button', { name: 'Datasets' })).toBeInTheDocument()
  })

  it('navigates staff sections after login', () => {
    render(<App />)
    // Log in
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'VC@P 2026' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))
    // Navigate to data portal
    fireEvent.click(screen.getByRole('button', { name: 'Data Portal' }))
    expect(screen.getByText('GIS Data Portal')).toBeInTheDocument()
  })

  it('navigates to sightings section after login', () => {
    sessionStorage.setItem('vcap2_staff_auth', '1')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    const sightingsButtons = screen.getAllByText('Sightings')
    fireEvent.click(sightingsButtons[0])
    expect(screen.getByText('Recent Sightings')).toBeInTheDocument()
  })

  it('navigates to locations section after login', () => {
    sessionStorage.setItem('vcap2_staff_auth', '1')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    const locationsButtons = screen.getAllByText('Locations')
    fireEvent.click(locationsButtons[0])
    expect(screen.getByText('Efate Island')).toBeInTheDocument()
  })

  it('shows placeholder for species section', () => {
    sessionStorage.setItem('vcap2_staff_auth', '1')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    fireEvent.click(screen.getByRole('button', { name: 'Species' }))
    expect(screen.getByText('Species catalog coming soon.')).toBeInTheDocument()
  })

  it('shows placeholder for settings section', () => {
    sessionStorage.setItem('vcap2_staff_auth', '1')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
    expect(screen.getByText('Settings page coming soon.')).toBeInTheDocument()
  })

  it('renders header with section title', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('switches to public page and shows about section', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'About' }))
    expect(screen.getByText('VCAP2 Public Data Portal')).toBeInTheDocument()
  })

  it('logs out and returns to public page', () => {
    sessionStorage.setItem('vcap2_staff_auth', '1')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    expect(screen.getByText('Total Surveys')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Log Out' }))
    expect(screen.getByRole('button', { name: 'Datasets' })).toBeInTheDocument()
  })

  it('restores staff auth from sessionStorage', () => {
    sessionStorage.setItem('vcap2_staff_auth', '1')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }))
    // Should go straight to staff overview without login
    expect(screen.getByText('Total Surveys')).toBeInTheDocument()
  })
})
