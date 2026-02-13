import { useState, useCallback, useEffect, useRef, type FC } from 'react'
import type { DatasetSummary, GeoDataset } from '../../types/geospatial'
import {
  listDatasets,
  getDataset,
  deleteDataset,
  exportAllDatasets,
  importDatasets,
  getStorageEstimate,
  formatBytes,
  migrateFromLocalStorage,
} from '../../services/datasetStore'
import {
  syncDatasets,
  getSyncSettings,
  saveSyncSettings,
  getSyncState,
  type GitHubSyncConfig,
} from '../../services/githubSync'
import DatasetUpload from './DatasetUpload'
import MapViewer from './MapViewer'
import './DataPortal.css'
import './GISDatabase.css'

interface GISDatabaseProps {
  onNavigate?: (section: string) => void
}

type DbView = 'browse' | 'upload'

const GISDatabase: FC<GISDatabaseProps> = ({ onNavigate }) => {
  const [view, setView] = useState<DbView>('browse')
  const [datasets, setDatasets] = useState<DatasetSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [storageUsed, setStorageUsed] = useState<number | null>(null)
  const [storageQuota, setStorageQuota] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [preview, setPreview] = useState<GeoDataset | null>(null)
  const [importStatus, setImportStatus] = useState('')
  const backupInputRef = useRef<HTMLInputElement>(null)

  // GitHub sync state
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState('')
  const [showSyncSettings, setShowSyncSettings] = useState(false)
  const [syncToken, setSyncToken] = useState('')
  const [syncOwner, setSyncOwner] = useState('welinrj')
  const [syncRepo, setSyncRepo] = useState('merremia-field-data')
  const [lastSync, setLastSync] = useState<string | null>(null)

  // Load sync settings on mount
  useEffect(() => {
    const config = getSyncSettings()
    if (config) {
      setSyncToken(config.token)
      setSyncOwner(config.owner)
      setSyncRepo(config.repo)
    }
    const state = getSyncState()
    setLastSync(state.lastSync)
  }, [])

  const refresh = useCallback(async () => {
    const list = await listDatasets()
    setDatasets(list)
    const est = await getStorageEstimate()
    if (est) {
      setStorageUsed(est.used)
      setStorageQuota(est.quota)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    migrateFromLocalStorage()
      .then(() => refresh())
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [refresh])

  const totalFeatures = datasets.reduce((sum, d) => sum + d.featureCount, 0)
  const totalSize = datasets.reduce((sum, d) => sum + d.sizeBytes, 0)

  async function handlePreview(id: string) {
    if (selectedId === id) {
      setSelectedId(null)
      setPreview(null)
      return
    }
    setSelectedId(id)
    const ds = await getDataset(id)
    setPreview(ds)
  }

  async function handleDelete(id: string) {
    const ds = datasets.find((d) => d.id === id)
    if (!window.confirm(`Delete "${ds?.metadata.name}"? This cannot be undone.`)) return
    await deleteDataset(id)
    if (selectedId === id) {
      setSelectedId(null)
      setPreview(null)
    }
    await refresh()
  }

  async function handleExportAll() {
    const all = await exportAllDatasets()
    const json = JSON.stringify(all, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vcap2-gis-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImportStatus('Importing...')
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      let toImport: GeoDataset[]
      if (Array.isArray(data)) {
        toImport = data
      } else if (data.type === 'FeatureCollection' || data.type === 'Feature' || data.coordinates) {
        setImportStatus('This is a GIS file — use the "Upload Dataset" button to add it to the database.')
        return
      } else {
        setImportStatus('Invalid backup file format.')
        return
      }

      const result = await importDatasets(toImport)
      await refresh()
      setImportStatus(
        `Imported ${result.imported} dataset${result.imported !== 1 ? 's' : ''}` +
        (result.skipped > 0 ? `, ${result.skipped} already existed` : ''),
      )
    } catch {
      setImportStatus('Failed to import — invalid file format.')
    }

    if (backupInputRef.current) backupInputRef.current.value = ''
  }

  async function handleExportOne(id: string) {
    const ds = await getDataset(id)
    if (!ds) return
    const json = JSON.stringify(ds.data, null, 2)
    const blob = new Blob([json], { type: 'application/geo+json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${ds.metadata.name.replace(/\s+/g, '_')}.geojson`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleSync() {
    const config: GitHubSyncConfig = {
      owner: syncOwner,
      repo: syncRepo,
      token: syncToken,
    }

    if (!config.token) {
      setShowSyncSettings(true)
      setSyncStatus('Please configure your GitHub token to sync.')
      return
    }

    saveSyncSettings(config)
    setSyncing(true)
    setSyncStatus('Syncing with GitHub...')

    try {
      const result = await syncDatasets(config)
      await refresh()

      const parts: string[] = []
      if (result.pushed > 0) parts.push(`${result.pushed} pushed`)
      if (result.pulled > 0) parts.push(`${result.pulled} pulled`)
      if (result.errors.length > 0) parts.push(`${result.errors.length} error${result.errors.length !== 1 ? 's' : ''}`)
      if (parts.length === 0) parts.push('Already in sync')

      setSyncStatus(parts.join(', '))
      setLastSync(new Date().toISOString())
    } catch (err) {
      setSyncStatus(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  function handleSaveSyncSettings() {
    saveSyncSettings({ owner: syncOwner, repo: syncRepo, token: syncToken })
    setShowSyncSettings(false)
    setSyncStatus('Settings saved.')
  }

  if (loading) {
    return (
      <div className="data-portal">
        <div className="portal-toolbar">
          <div className="portal-toolbar-left">
            <h2>GIS Database</h2>
            <span className="dataset-count">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'upload') {
    return (
      <div className="data-portal">
        <DatasetUpload
          onUploaded={async () => {
            await refresh()
            setView('browse')
            setImportStatus('Dataset uploaded and stored to database.')
          }}
          onCancel={() => setView('browse')}
        />
      </div>
    )
  }

  return (
    <div className="data-portal">
      <div className="portal-toolbar">
        <div className="portal-toolbar-left">
          <h2>GIS Database</h2>
          <span className="dataset-count">
            {datasets.length} dataset{datasets.length !== 1 ? 's' : ''} stored
          </span>
        </div>
        <div className="portal-toolbar-right">
          <input
            ref={backupInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            hidden
          />
          <button
            className="btn btn-secondary"
            onClick={() => backupInputRef.current?.click()}
          >
            Restore Backup
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleExportAll}
            disabled={datasets.length === 0}
          >
            Export Backup
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setView('upload')}
          >
            Upload Dataset
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="db-import-status" role="status">
          {importStatus}
          <button className="db-dismiss" onClick={() => setImportStatus('')} aria-label="Dismiss">
            &times;
          </button>
        </div>
      )}

      {/* Storage stats */}
      <div className="db-stats-grid">
        <div className="db-stat-card">
          <span className="db-stat-value">{datasets.length}</span>
          <span className="db-stat-label">Datasets</span>
        </div>
        <div className="db-stat-card">
          <span className="db-stat-value">{totalFeatures.toLocaleString()}</span>
          <span className="db-stat-label">Total Features</span>
        </div>
        <div className="db-stat-card">
          <span className="db-stat-value">{formatBytes(totalSize)}</span>
          <span className="db-stat-label">Data Size</span>
        </div>
        <div className="db-stat-card">
          <span className="db-stat-value">
            {storageQuota ? formatBytes(storageQuota - (storageUsed ?? 0)) : 'N/A'}
          </span>
          <span className="db-stat-label">Storage Available</span>
        </div>
      </div>

      {storageUsed != null && storageQuota != null && storageQuota > 0 && (
        <div className="db-storage-bar-container">
          <div className="db-storage-bar">
            <div
              className="db-storage-bar-fill"
              style={{ width: `${Math.min((storageUsed / storageQuota) * 100, 100)}%` }}
            />
          </div>
          <span className="db-storage-text">
            {formatBytes(storageUsed)} of {formatBytes(storageQuota)} used
          </span>
        </div>
      )}

      {/* GitHub Sync */}
      <div className="db-sync-section">
        <div className="db-sync-row">
          <div className="db-sync-info">
            <strong>GitHub Sync</strong>
            {lastSync && (
              <span className="db-sync-last">
                Last sync: {new Date(lastSync).toLocaleString()}
              </span>
            )}
          </div>
          <div className="db-sync-actions">
            <button
              className="btn btn-sm"
              onClick={() => setShowSyncSettings(!showSyncSettings)}
            >
              Settings
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
        {syncStatus && (
          <div className="db-sync-status" role="status">
            {syncStatus}
            <button className="db-dismiss" onClick={() => setSyncStatus('')} aria-label="Dismiss">
              &times;
            </button>
          </div>
        )}
        {showSyncSettings && (
          <div className="db-sync-settings">
            <div className="db-sync-field">
              <label htmlFor="sync-token">GitHub Token</label>
              <input
                id="sync-token"
                type="password"
                value={syncToken}
                onChange={(e) => setSyncToken(e.target.value)}
                placeholder="ghp_... (Personal Access Token)"
              />
            </div>
            <div className="db-sync-field-row">
              <div className="db-sync-field">
                <label htmlFor="sync-owner">Owner</label>
                <input
                  id="sync-owner"
                  type="text"
                  value={syncOwner}
                  onChange={(e) => setSyncOwner(e.target.value)}
                />
              </div>
              <div className="db-sync-field">
                <label htmlFor="sync-repo">Repository</label>
                <input
                  id="sync-repo"
                  type="text"
                  value={syncRepo}
                  onChange={(e) => setSyncRepo(e.target.value)}
                />
              </div>
            </div>
            <div className="db-sync-field-actions">
              <button className="btn btn-sm btn-primary" onClick={handleSaveSyncSettings}>
                Save Settings
              </button>
              <button className="btn btn-sm" onClick={() => setShowSyncSettings(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dataset table */}
      {datasets.length === 0 ? (
        <div className="portal-empty">
          <p>No datasets in the database yet.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Click <strong>Upload Dataset</strong> to add GIS files (GeoJSON, CSV, KML), or use <strong>Restore Backup</strong> to import a previous export.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => setView('upload')}
            >
              Upload Your First Dataset
            </button>
            {onNavigate && (
              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('data-portal')}
              >
                Go to Data Portal
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Format</th>
                <th>Features</th>
                <th>Size</th>
                <th>Status</th>
                <th>Stored</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((ds) => (
                <tr key={ds.id} className={selectedId === ds.id ? 'db-row-selected' : ''}>
                  <td>
                    <button className="link-button" onClick={() => handlePreview(ds.id)}>
                      {ds.metadata.name}
                    </button>
                    {ds.metadata.description && (
                      <span className="dataset-description">{ds.metadata.description}</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-format">{ds.format.toUpperCase()}</span>
                  </td>
                  <td>{ds.featureCount.toLocaleString()}</td>
                  <td>{formatBytes(ds.sizeBytes)}</td>
                  <td>
                    <span className={`badge badge-${ds.metadata.status}`}>
                      {ds.metadata.status}
                    </span>
                  </td>
                  <td>{new Date(ds.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm"
                        onClick={() => handleExportOne(ds.id)}
                        title="Download as GeoJSON"
                      >
                        Download
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(ds.id)}
                        title="Delete from database"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Map preview */}
      {preview && (
        <div className="db-preview">
          <div className="db-preview-header">
            <h3>Preview: {preview.metadata.name}</h3>
            <button className="btn btn-sm" onClick={() => { setSelectedId(null); setPreview(null) }}>
              Close
            </button>
          </div>
          <div className="db-preview-meta">
            <span>{preview.featureCount} features</span>
            <span>{preview.format.toUpperCase()}</span>
            <span>{formatBytes(preview.sizeBytes)}</span>
            {preview.bbox && (
              <span>
                Bbox: [{preview.bbox.map((v) => v.toFixed(2)).join(', ')}]
              </span>
            )}
          </div>
          <MapViewer data={preview.data} height="350px" />
        </div>
      )}
    </div>
  )
}

export default GISDatabase
