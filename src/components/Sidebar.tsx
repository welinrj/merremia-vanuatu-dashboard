import type { FC } from 'react'

interface SidebarProps {
  activePage: 'staff' | 'public'
  activeSection: string
  onPageChange: (page: 'staff' | 'public') => void
  onNavigate: (section: string) => void
}

const staffNavItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'data-portal', label: 'Data Portal' },
  { id: 'gis-database', label: 'GIS Database' },
  { id: 'sightings', label: 'Sightings' },
  { id: 'locations', label: 'Locations' },
  { id: 'species', label: 'Species' },
  { id: 'settings', label: 'Settings' },
]

const publicNavItems = [
  { id: 'datasets', label: 'Datasets' },
  { id: 'about', label: 'About' },
]

const Sidebar: FC<SidebarProps> = ({ activePage, activeSection, onPageChange, onNavigate }) => {
  const navItems = activePage === 'staff' ? staffNavItems : publicNavItems

  return (
    <aside className={`sidebar${activePage === 'public' ? ' public-sidebar' : ''}`}>
      <div className="sidebar-header">
        <h2>VCAP2</h2>
        <div className="page-switcher">
          <button
            className={`page-switcher-btn${activePage === 'staff' ? ' active' : ''}`}
            onClick={() => onPageChange('staff')}
          >
            Staff
          </button>
          <button
            className={`page-switcher-btn${activePage === 'public' ? ' active' : ''}`}
            onClick={() => onPageChange('public')}
          >
            Public
          </button>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={item.label}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        {activePage === 'public' && (
          <span className="public-badge">Read-Only Access</span>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
