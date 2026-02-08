import type { FC } from 'react'
import type { LocationSummary } from '../types/dashboard'

interface LocationListProps {
  locations: LocationSummary[]
}

const LocationList: FC<LocationListProps> = ({ locations }) => {
  return (
    <div className="location-list">
      <h3>Locations</h3>
      <ul>
        {locations.map((loc) => (
          <li key={loc.name} className="location-item">
            <span className="location-name">{loc.name}</span>
            <div className="location-stats">
              <span>{loc.totalSightings} sightings</span>
              <span>{loc.speciesCount} species</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LocationList
