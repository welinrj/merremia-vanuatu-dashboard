import type { FC } from 'react'

interface SidebarProps {
  activePage: 'staff' | 'public'
  activeSection: string
  onPageChange: (page: 'staff' | 'public') => void
  onNavigate: (section: string) => void
  staffAuth: boolean
  onLogout: () => void
}

const staffNavItems = [
  { id: 'data-portal', label: 'Data Portal' },
  { id: 'gis-database', label: 'GIS Database' },
]

const publicNavItems = [
  { id: 'datasets', label: 'Datasets' },
  { id: 'about', label: 'About' },
]

const Sidebar: FC<SidebarProps> = ({ activePage, activeSection, onPageChange, onNavigate, staffAuth, onLogout }) => {
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
        {activePage === 'staff' && staffAuth && (
          <button className="nav-item logout-btn" onClick={onLogout}>
            Log Out
          </button>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
