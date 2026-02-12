import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatCard from './components/StatCard'
import SightingsTable from './components/SightingsTable'
import LocationList from './components/LocationList'
import DataPortal from './components/portal/DataPortal'
import GISDatabase from './components/portal/GISDatabase'
import PublicDataPortal from './components/public/PublicDataPortal'
import StaffLogin from './components/StaffLogin'
import { stats, recentSightings, locationSummaries } from './data/sampleData'
import './App.css'

const sectionTitles: Record<string, string> = {
  overview: 'Overview',
  'data-portal': 'Data Portal',
  'gis-database': 'GIS Database',
  sightings: 'Sightings',
  locations: 'Locations',
  species: 'Species',
  settings: 'Settings',
  datasets: 'Datasets',
  about: 'About',
}

function App() {
  const [activePage, setActivePage] = useState<'staff' | 'public'>('public')
  const [activeSection, setActiveSection] = useState('datasets')
  const [staffAuth, setStaffAuth] = useState(
    () => sessionStorage.getItem('vcap2_staff_auth') === '1'
  )

  const handlePageChange = (page: 'staff' | 'public') => {
    if (page === 'staff' && !staffAuth) {
      setActivePage('staff')
      return
    }
    setActivePage(page)
    setActiveSection(page === 'staff' ? 'overview' : 'datasets')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('vcap2_staff_auth')
    setStaffAuth(false)
    setActivePage('public')
    setActiveSection('datasets')
  }

  // Show login form when staff page is selected but not authenticated
  if (activePage === 'staff' && !staffAuth) {
    return (
      <StaffLogin
        onSuccess={() => {
          setStaffAuth(true)
          setActiveSection('overview')
        }}
        onCancel={() => {
          setActivePage('public')
          setActiveSection('datasets')
        }}
      />
    )
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        activeSection={activeSection}
        onPageChange={handlePageChange}
        onNavigate={setActiveSection}
        staffAuth={staffAuth}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <Header title={sectionTitles[activeSection] ?? activeSection} />
        <div className="dashboard-content">
          {/* Staff page sections */}
          {activeSection === 'overview' && (
            <>
              <section className="stats-grid">
                {stats.map((stat) => (
                  <StatCard key={stat.title} data={stat} />
                ))}
              </section>
              <div className="dashboard-panels">
                <SightingsTable sightings={recentSightings} />
                <LocationList locations={locationSummaries} />
              </div>
            </>
          )}
          {activeSection === 'data-portal' && (
            <DataPortal onNavigate={setActiveSection} />
          )}
          {activeSection === 'gis-database' && (
            <GISDatabase onNavigate={setActiveSection} />
          )}
          {activeSection === 'sightings' && (
            <SightingsTable sightings={recentSightings} />
          )}
          {activeSection === 'locations' && (
            <LocationList locations={locationSummaries} />
          )}
          {activeSection === 'species' && (
            <div className="placeholder-section">
              <p>Species catalog coming soon.</p>
            </div>
          )}
          {activeSection === 'settings' && (
            <div className="placeholder-section">
              <p>Settings page coming soon.</p>
            </div>
          )}

          {/* Public page sections */}
          {activeSection === 'datasets' && <PublicDataPortal />}
          {activeSection === 'about' && (
            <div className="placeholder-section">
              <h3>VCAP2 Public Data Portal</h3>
              <p style={{ marginTop: '0.75rem' }}>
                This public portal provides read-only access to geospatial datasets
                published by the Vanuatu Climate Adaptation Project 2 (VCAP2) and the
                Department of Environmental Protection &amp; Conservation (DEPC).
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                Datasets are uploaded and managed by authorized staff via the Staff page.
                The public can view, explore, and download datasets shared here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
