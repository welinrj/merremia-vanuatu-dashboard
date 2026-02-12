import { useState, useCallback, type FC } from 'react'
import type { DatasetSummary, GeoDataset } from '../../types/geospatial'
import { listDatasets, getDataset } from '../../services/datasetStore'
import PublicDatasetList from './PublicDatasetList'
import PublicDatasetDetail from './PublicDatasetDetail'
import './PublicPortal.css'

type PortalView = 'list' | 'detail'

const PublicDataPortal: FC = () => {
  const [view, setView] = useState<PortalView>('list')
  const [datasets] = useState<DatasetSummary[]>(() => {
    return listDatasets().filter((ds) => ds.metadata.status === 'active')
  })
  const [activeDataset, setActiveDataset] = useState<GeoDataset | null>(null)

  const handleView = useCallback((id: string) => {
    const ds = getDataset(id)
    if (ds) {
      setActiveDataset(ds)
      setView('detail')
    }
  }, [])

  return (
    <div className="data-portal">
      {view === 'list' && (
        <>
          <div className="portal-toolbar">
            <div className="portal-toolbar-left">
              <h2>Published Datasets</h2>
              <span className="dataset-count">
                {datasets.length} dataset{datasets.length !== 1 ? 's' : ''} available
              </span>
            </div>
            <div className="portal-toolbar-right">
              <span className="public-read-only-badge">Read-Only</span>
            </div>
          </div>
          {datasets.length === 0 ? (
            <div className="portal-empty">
              <p>No published datasets available yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Datasets will appear here once they are published by DEPC staff.
              </p>
            </div>
          ) : (
            <PublicDatasetList datasets={datasets} onView={handleView} />
          )}
        </>
      )}

      {view === 'detail' && activeDataset && (
        <PublicDatasetDetail
          dataset={activeDataset}
          onBack={() => {
            setActiveDataset(null)
            setView('list')
          }}
        />
      )}
    </div>
  )
}

export default PublicDataPortal
