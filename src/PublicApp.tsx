import { useState } from 'react'
import PublicSidebar from './components/public/PublicSidebar'
import Header from './components/Header'
import PublicDataPortal from './components/public/PublicDataPortal'
import './App.css'

const sectionTitles: Record<string, string> = {
  datasets: 'Datasets',
  about: 'About',
}

function PublicApp() {
  const [activeSection, setActiveSection] = useState('datasets')

  return (
    <div className="app-layout">
      <PublicSidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="main-content">
        <Header title={sectionTitles[activeSection] ?? activeSection} />
        <div className="dashboard-content">
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
                Datasets are uploaded and managed by authorized staff via the In-House Portal.
                The public can view, explore, and download datasets shared here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PublicApp
