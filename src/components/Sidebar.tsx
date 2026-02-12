import type { FC } from 'react'

interface SidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'data-portal', label: 'Data Portal' },
  { id: 'gis-database', label: 'GIS Database' },
  { id: 'sightings', label: 'Sightings' },
  { id: 'locations', label: 'Locations' },
  { id: 'species', label: 'Species' },
  { id: 'settings', label: 'Settings' },
]

const publicPortalUrl = import.meta.env.BASE_URL + 'public.html'

const Sidebar: FC<SidebarProps> = ({ activeSection, onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Merremia</h2>
        <span className="sidebar-subtitle">In-House Portal</span>
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
        <a href={publicPortalUrl} className="nav-item public-portal-link" target="_blank" rel="noopener noreferrer">
          Public Portal &rarr;
        </a>
      </div>
    </aside>
  )
}

export default Sidebar
