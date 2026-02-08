import type { FC } from 'react'
import type { SightingRecord } from '../types/dashboard'

interface SightingsTableProps {
  sightings: SightingRecord[]
}

const SightingsTable: FC<SightingsTableProps> = ({ sightings }) => {
  return (
    <div className="table-container">
      <h3>Recent Sightings</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Location</th>
            <th>Species</th>
            <th>Count</th>
            <th>Observer</th>
          </tr>
        </thead>
        <tbody>
          {sightings.map((s) => (
            <tr key={s.id}>
              <td>{s.date}</td>
              <td>{s.location}</td>
              <td className="species-name">{s.species}</td>
              <td>{s.count}</td>
              <td>{s.observer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SightingsTable
