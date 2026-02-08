import type { FC } from 'react'
import type { StatCardData } from '../types/dashboard'

interface StatCardProps {
  data: StatCardData
}

const StatCard: FC<StatCardProps> = ({ data }) => {
  const changeClass =
    data.change !== undefined
      ? data.change > 0
        ? 'positive'
        : data.change < 0
          ? 'negative'
          : 'neutral'
      : ''

  return (
    <div className="stat-card">
      <span className="stat-title">{data.title}</span>
      <span className="stat-value">
        {data.value}
        {data.unit && <span className="stat-unit">{data.unit}</span>}
      </span>
      {data.change !== undefined && (
        <span className={`stat-change ${changeClass}`}>
          {data.change > 0 ? '+' : ''}
          {data.change}%
        </span>
      )}
    </div>
  )
}

export default StatCard
