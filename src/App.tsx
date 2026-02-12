import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatCard from './components/StatCard'
import SightingsTable from './components/SightingsTable'
import LocationList from './components/LocationList'
import DataPortal from './components/portal/DataPortal'
import GISDatabase from './components/portal/GISDatabase'
import PublicDataPortal from './components/public/PublicDataPortal'
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
  const [activePage, setActivePage] = useState<'staff' | 'public'>('staff')
  const [activeSection, setActiveSection] = useState('overview')

  const handlePageChange = (page: 'staff' | 'public') => {
    setActivePage(page)
    setActiveSection(page === 'staff' ? 'overview' : 'datasets')
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        activeSection={activeSection}
        onPageChange={handlePageChange}
        onNavigate={setActiveSection}
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
