import type { FC } from 'react'

interface SidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'data-portal', label: 'Data Portal' },
  { id: 'sightings', label: 'Sightings' },
  { id: 'locations', label: 'Locations' },
  { id: 'species', label: 'Species' },
  { id: 'settings', label: 'Settings' },
]

const Sidebar: FC<SidebarProps> = ({ activeSection, onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Merremia</h2>
        <span className="sidebar-subtitle">Vanuatu Dashboard</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
