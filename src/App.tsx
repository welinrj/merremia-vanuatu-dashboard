import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DataPortal from './components/portal/DataPortal'
import GISDatabase from './components/portal/GISDatabase'
import PublicDataPortal from './components/public/PublicDataPortal'
import StaffLogin from './components/StaffLogin'
import './App.css'

const sectionTitles: Record<string, string> = {
  'data-portal': 'Data Portal',
  'gis-database': 'GIS Database',
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
    setActiveSection(page === 'staff' ? 'data-portal' : 'datasets')
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
          setActiveSection('data-portal')
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
          {activeSection === 'data-portal' && (
            <DataPortal onNavigate={setActiveSection} />
          )}
          {activeSection === 'gis-database' && (
            <GISDatabase onNavigate={setActiveSection} />
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
