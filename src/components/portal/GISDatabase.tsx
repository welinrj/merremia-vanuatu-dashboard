import React, { useState, useEffect } from 'react';
import { Upload, Search, Download, Map, Filter, FileText, Database, Lock, Globe, Shield } from 'lucide-react';
import type {
  GISDataset,
  GISMetadata,
  GISCategory,
  AccessClassification,
  UpdateFrequency,
  DataFormat,
  GISSearchFilters,
  GeometryType
} from '../types/gis';
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  ACCESS_ICONS,
  generateFileName,
  isValidGeoJSON
} from '../types/gis';
import { UploadView, MetadataCatalogView, MetadataModal } from './GISUpload';

export default function GISDatabase() {
  const [datasets, setDatasets] = useState<GISDataset[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<GISDataset[]>([]);
  const [view, setView] = useState<'browse' | 'upload' | 'metadata'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<GISSearchFilters>({});
  const [selectedDataset, setSelectedDataset] = useState<GISDataset | null>(null);
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  // Load datasets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('depc-gis-datasets');
    if (stored) {
      try {
        const loaded = JSON.parse(stored);
        setDatasets(loaded);
        setFilteredDatasets(loaded);
      } catch (e) {
        console.error('Failed to load GIS datasets:', e);
      }
    }
  }, []);

  // Save datasets to localStorage
  useEffect(() => {
    if (datasets.length > 0) {
      localStorage.setItem('depc-gis-datasets', JSON.stringify(datasets));
    }
  }, [datasets]);

  // Filter datasets
  useEffect(() => {
    let filtered = datasets;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.metadata.datasetName.toLowerCase().includes(term) ||
        d.metadata.description.toLowerCase().includes(term) ||
        d.metadata.keywords.some(k => k.toLowerCase().includes(term))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(d => d.metadata.category === filters.category);
    }

    if (filters.accessClassification) {
      filtered = filtered.filter(d => d.metadata.accessClassification === filters.accessClassification);
    }

    if (filters.custodian) {
      filtered = filtered.filter(d => d.metadata.custodianAgency.toLowerCase().includes(filters.custodian!.toLowerCase()));
    }

    setFilteredDatasets(filtered);
  }, [searchTerm, filters, datasets]);

  const handleAddDataset = (dataset: GISDataset) => {
    setDatasets(prev => [...prev, dataset]);
  };

  const handleDeleteDataset = (id: string) => {
    if (confirm('Are you sure you want to delete this dataset?')) {
      setDatasets(prev => prev.filter(d => d.metadata.id !== id));
    }
  };

  const handleDownloadMetadata = (dataset: GISDataset) => {
    const blob = new Blob([JSON.stringify(dataset.metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.metadata.fileName.replace(/\.[^.]+$/, '')}_metadata.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadData = (dataset: GISDataset) => {
    if (!dataset.data) {
      alert('No data available for download');
      return;
    }

    const blob = new Blob([JSON.stringify(dataset.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dataset.metadata.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    datasets.forEach(d => {
      stats[d.metadata.category] = (stats[d.metadata.category] || 0) + 1;
    });
    return stats;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8" />
          <h1 className="text-2xl font-bold">DEPC GIS Database</h1>
        </div>
        <p className="text-emerald-100 text-sm">
          Centralized geospatial data repository • ISO 19115 compliant
        </p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{datasets.length}</div>
            <div className="text-xs text-emerald-100">Total Datasets</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">
              {datasets.filter(d => d.metadata.accessClassification === 'Public').length}
            </div>
            <div className="text-xs text-emerald-100">Public</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">
              {datasets.filter(d => d.metadata.format === 'GeoJSON').length}
            </div>
            <div className="text-xs text-emerald-100">GeoJSON</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">
              {Object.keys(getCategoryStats()).length}
            </div>
            <div className="text-xs text-emerald-100">Categories</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex">
          <button
            onClick={() => setView('browse')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              view === 'browse'
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            <Database className="w-4 h-4" />
            Browse Datasets
          </button>
          <button
            onClick={() => setView('upload')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              view === 'upload'
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Dataset
          </button>
          <button
            onClick={() => setView('metadata')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              view === 'metadata'
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Metadata Catalog
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {view === 'browse' && (
          <BrowseView
            datasets={filteredDatasets}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            onDownloadMetadata={handleDownloadMetadata}
            onDownloadData={handleDownloadData}
            onDelete={handleDeleteDataset}
            onViewDetails={(dataset) => {
              setSelectedDataset(dataset);
              setShowMetadataModal(true);
            }}
          />
        )}

        {view === 'upload' && (
          <UploadView onAddDataset={handleAddDataset} />
        )}

        {view === 'metadata' && (
          <MetadataCatalogView
            datasets={datasets}
            onDownloadMetadata={handleDownloadMetadata}
          />
        )}
      </div>

      {/* Metadata Modal */}
      {showMetadataModal && selectedDataset && (
        <MetadataModal
          dataset={selectedDataset}
          onClose={() => {
            setShowMetadataModal(false);
            setSelectedDataset(null);
          }}
          onDownload={handleDownloadMetadata}
        />
      )}
    </div>
  );
}

// Browse View Component
function BrowseView({
  datasets,
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  onDownloadMetadata,
  onDownloadData,
  onDelete,
  onViewDetails
}: any) {
  return (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search datasets, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value as GISCategory || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={filters.accessClassification || ''}
            onChange={(e) => setFilters({ ...filters, accessClassification: e.target.value as AccessClassification || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Access Levels</option>
            <option value="Public">Public</option>
            <option value="Restricted">Restricted</option>
            <option value="Confidential">Confidential</option>
          </select>
        </div>

        {Object.keys(filters).filter(k => filters[k as keyof GISSearchFilters]).length > 0 && (
          <button
            onClick={() => setFilters({})}
            className="mt-3 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results */}
      <div className="grid gap-4">
        {datasets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No datasets found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : 'Upload your first dataset to get started'}
            </p>
          </div>
        ) : (
          datasets.map((dataset: GISDataset) => (
            <DatasetCard
              key={dataset.metadata.id}
              dataset={dataset}
              onDownloadMetadata={onDownloadMetadata}
              onDownloadData={onDownloadData}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Dataset Card Component
function DatasetCard({ dataset, onDownloadMetadata, onDownloadData, onDelete, onViewDetails }: any) {
  const { metadata } = dataset;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {CATEGORY_ICONS[metadata.category]}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{metadata.datasetName}</h3>
              <p className="text-sm text-gray-500">{CATEGORY_LABELS[metadata.category]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              metadata.accessClassification === 'Public'
                ? 'bg-green-100 text-green-800'
                : metadata.accessClassification === 'Restricted'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {ACCESS_ICONS[metadata.accessClassification]} {metadata.accessClassification}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {metadata.format}
            </span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{metadata.description}</p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Custodian:</span>
            <span>{metadata.custodianAgency}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Coverage:</span>
            <span>{metadata.geographicCoverage}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Updated:</span>
            <span>{new Date(metadata.dateUpdated).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">CRS:</span>
            <span>{metadata.coordinateReferenceSystem}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {metadata.keywords.slice(0, 4).map((keyword, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {keyword}
            </span>
          ))}
          {metadata.keywords.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
              +{metadata.keywords.length - 4} more
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(dataset)}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => onDownloadMetadata(dataset)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            title="Download Metadata"
          >
            <FileText className="w-4 h-4" />
          </button>
          {dataset.data && (
            <button
              onClick={() => onDownloadData(dataset)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              title="Download Data"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(metadata.id)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            title="Delete Dataset"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

// Upload View Component (continued in next file due to length)
