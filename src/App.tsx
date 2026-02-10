import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatCard from './components/StatCard'
import SightingsTable from './components/SightingsTable'
import LocationList from './components/LocationList'
import DataPortal from './components/portal/DataPortal'
import { stats, recentSightings, locationSummaries } from './data/sampleData'
import './App.css'

const sectionTitles: Record<string, string> = {
  overview: 'Overview',
  'data-portal': 'Data Portal',
  sightings: 'Sightings',
  locations: 'Locations',
  species: 'Species',
  settings: 'Settings',
}

function App() {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <div className="app-layout">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="main-content">
        <Header title={sectionTitles[activeSection] ?? activeSection} />
        <div className="dashboard-content">
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
          {activeSection === 'data-portal' && <DataPortal />}
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
        </div>
      </main>
    </div>
  )
}

export default App
