import type { FC } from 'react'

interface HeaderProps {
  title: string
}

const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <div className="header-actions">
        <input
          type="search"
          placeholder="Search..."
          className="search-input"
          aria-label="Search"
        />
      </div>
    </header>
  )
}

export default Header
