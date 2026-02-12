import type { FC } from 'react'

interface PublicSidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

const navItems = [
  { id: 'datasets', label: 'Datasets' },
  { id: 'about', label: 'About' },
]

const inHousePortalUrl = import.meta.env.BASE_URL + 'app.html'

const PublicSidebar: FC<PublicSidebarProps> = ({ activeSection, onNavigate }) => {
  return (
    <aside className="sidebar public-sidebar">
      <div className="sidebar-header">
        <h2>Merremia</h2>
        <span className="sidebar-subtitle">Public Portal</span>
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
      <div className="sidebar-footer">
        <span className="public-badge">Read-Only Access</span>
        <a href={inHousePortalUrl} className="nav-item public-portal-link" target="_blank" rel="noopener noreferrer">
          Staff Login &rarr;
        </a>
      </div>
    </aside>
  )
}

export default PublicSidebar
