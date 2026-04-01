import type { FC } from 'react'
import type { UserProfile } from '../types/user'

interface SidebarProps {
  activePage: 'staff' | 'public'
  activeSection: string
  onPageChange: (page: 'staff' | 'public') => void
  onNavigate: (section: string) => void
  staffAuth: boolean
  onLogout: () => void
  user: UserProfile | null
}

const publicNavItems = [
  { id: 'datasets', label: 'Datasets' },
  { id: 'prodoc-tracker', label: 'ProDoc Tracker' },
  { id: 'about', label: 'About' },
]

const managementNavItems = [
  { id: 'gis-database', label: 'GIS Database' },
  { id: 'protected-areas', label: 'CCAs & MPAs' },
  { id: 'fisheries-dashboard', label: 'Fisheries Dashboard' },
  { id: 'me-dashboard', label: 'M&E Dashboard' },
  { id: 'activity-planner', label: 'Activity Planner' },
  { id: 'quarterly-log', label: 'Quarterly Log' },
  { id: 'risk-register', label: 'Risk Register' },
  { id: 'file-manager', label: 'File Manager' },
  { id: 'activity-calendar', label: 'Activity Calendar' },
  { id: 'messages', label: 'Messages' },
]

const Sidebar: FC<SidebarProps> = ({ activePage, activeSection, onPageChange, onNavigate, staffAuth, onLogout, user }) => {
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
        <div className="sidebar-section-label">PUBLIC</div>
        <ul>
          {publicNavItems.map((item) => (
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
        {(activePage === 'staff' || staffAuth) && (
          <>
            <div className="sidebar-section-label">MANAGEMENT</div>
            <ul>
              {managementNavItems.map((item) => (
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
          </>
        )}
      </nav>
      <div className="sidebar-footer">
        {activePage === 'public' && (
          <span className="public-badge">Read-Only Access</span>
        )}
        {activePage === 'staff' && staffAuth && (
          <div className="sidebar-user-section">
            {user && (
              <div className="sidebar-user-info">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="sidebar-avatar" />
                ) : (
                  <span className="sidebar-avatar sidebar-avatar-fallback">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="sidebar-user-name">{user.name}</span>
              </div>
            )}
            <button className="nav-item logout-btn" onClick={onLogout}>
              Log Out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
