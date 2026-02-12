import { useState, useCallback, useEffect, type FC } from 'react'
import type { DatasetSummary } from '../../types/geospatial'
import {
  listDatasets,
  getDataset,
  deleteDataset,
  updateDatasetMetadata,
  addDataset,
  migrateFromLocalStorage,
} from '../../services/datasetStore'
import {
  vanuatuSightingsGeoJSON,
  vanuatuIslandBoundaries,
} from '../../data/sampleGeoData'
import DatasetList from './DatasetList'
import DatasetUpload from './DatasetUpload'
import DatasetDetail from './DatasetDetail'
import DatasetEditor from './DatasetEditor'
import type { GeoDataset, DatasetMetadata } from '../../types/geospatial'
import './DataPortal.css'

type PortalView = 'list' | 'upload' | 'detail' | 'edit'

const DataPortal: FC = () => {
  const [view, setView] = useState<PortalView>('list')
  const [datasets, setDatasets] = useState<DatasetSummary[]>([])
  const [activeDataset, setActiveDataset] = useState<GeoDataset | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const list = await listDatasets()
    setDatasets(list)
  }, [])

  useEffect(() => {
    migrateFromLocalStorage()
      .then(() => refresh())
      .finally(() => setLoading(false))
  }, [refresh])

  async function handleView(id: string) {
    const ds = await getDataset(id)
    if (ds) {
      setActiveDataset(ds)
      setView('detail')
    }
  }

  async function handleEdit(id: string) {
    const ds = await getDataset(id)
    if (ds) {
      setActiveDataset(ds)
      setView('edit')
    }
  }

  async function handleDelete(id: string) {
    const ds = datasets.find((d) => d.id === id)
    const confirmed = window.confirm(
      `Delete dataset "${ds?.metadata.name ?? id}"? This cannot be undone.`,
    )
    if (confirmed) {
      await deleteDataset(id)
      await refresh()
      if (activeDataset?.id === id) {
        setActiveDataset(null)
        setView('list')
      }
    }
  }

  async function handleSaveMetadata(updates: Partial<DatasetMetadata>) {
    if (!activeDataset) return
    const updated = await updateDatasetMetadata(activeDataset.id, updates)
    if (updated) {
      setActiveDataset(updated)
      await refresh()
      setView('detail')
    }
  }

  async function loadSampleData() {
    const existing = await listDatasets()
    if (existing.some((d) => d.metadata.name === 'Merremia Sightings')) return

    await addDataset(
      vanuatuSightingsGeoJSON,
      {
        name: 'Merremia Sightings',
        description: 'Vine sighting locations across Vanuatu islands',
        source: 'Field Survey 2026',
        tags: ['merremia', 'sightings', 'vanuatu'],
      },
      'geojson',
    )
    await addDataset(
      vanuatuIslandBoundaries,
      {
        name: 'Island Survey Boundaries',
        description: 'Survey area boundaries for major Vanuatu islands',
        source: 'National GIS Office',
        tags: ['boundaries', 'islands', 'survey-areas'],
      },
      'geojson',
    )
    await refresh()
  }

  if (loading) {
    return (
      <div className="data-portal">
        <div className="portal-toolbar">
          <div className="portal-toolbar-left">
            <h2>GIS Data Portal</h2>
            <span className="dataset-count">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="data-portal">
      {view === 'list' && (
        <>
          <div className="portal-toolbar">
            <div className="portal-toolbar-left">
              <h2>GIS Data Portal</h2>
              <span className="dataset-count">
                {datasets.length} dataset{datasets.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="portal-toolbar-right">
              {datasets.length === 0 && (
                <button
                  className="btn btn-secondary"
                  onClick={loadSampleData}
                >
                  Load Sample Data
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => setView('upload')}
              >
                Upload Dataset
              </button>
            </div>
          </div>
          <DatasetList
            datasets={datasets}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {view === 'upload' && (
        <DatasetUpload
          onUploaded={() => {
            refresh()
            setView('list')
          }}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'detail' && activeDataset && (
        <DatasetDetail
          dataset={activeDataset}
          onBack={() => {
            setActiveDataset(null)
            setView('list')
          }}
          onEdit={() => setView('edit')}
          onDelete={() => handleDelete(activeDataset.id)}
        />
      )}

      {view === 'edit' && activeDataset && (
        <DatasetEditor
          metadata={activeDataset.metadata}
          onSave={handleSaveMetadata}
          onCancel={() => setView(activeDataset ? 'detail' : 'list')}
        />
      )}
    </div>
  )
}

export default DataPortal
