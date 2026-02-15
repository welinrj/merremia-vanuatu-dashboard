import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, X } from 'lucide-react';
import type {
  GISDataset,
  GISMetadata,
  GISCategory,
  AccessClassification,
  UpdateFrequency,
  DataFormat,
  GeometryType
} from '../types/gis';
import { generateFileName, isValidGeoJSON } from '../types/gis';

interface UploadViewProps {
  onAddDataset: (dataset: GISDataset) => void;
}

export function UploadView({ onAddDataset }: UploadViewProps) {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [metadata, setMetadata] = useState<Partial<GISMetadata>>({
    coordinateReferenceSystem: 'EPSG:4326',
    format: 'GeoJSON',
    language: 'en',
    keywords: [],
    accessClassification: 'Public',
    updateFrequency: 'Annual'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [keywordInput, setKeywordInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // Validate GeoJSON
        if (!isValidGeoJSON(data)) {
          setErrors({ file: 'Invalid GeoJSON format' });
          return;
        }

        setFileData(data);

        // Auto-detect metadata
        const features = data.type === 'FeatureCollection' ? data.features : [data];
        const geometryType = features[0]?.geometry?.type || 'Unknown';

        setMetadata(prev => ({
          ...prev,
          geometryType: geometryType as GeometryType,
          featureCount: features.length,
          fileSize: file.size
        }));

        setStep(2);
        setErrors({});
      } catch (err) {
        setErrors({ file: 'Failed to parse file. Ensure it is valid GeoJSON.' });
      }
    };

    reader.readAsText(file);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setMetadata(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (idx: number) => {
    setMetadata(prev => ({
      ...prev,
      keywords: prev.keywords?.filter((_, i) => i !== idx) || []
    }));
  };

  const validateMetadata = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!metadata.datasetName?.trim()) newErrors.datasetName = 'Dataset name is required';
    if (!metadata.description?.trim()) newErrors.description = 'Description is required';
    if (!metadata.custodianAgency?.trim()) newErrors.custodianAgency = 'Custodian agency is required';
    if (!metadata.contactPerson?.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!metadata.contactEmail?.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!metadata.geographicCoverage?.trim()) newErrors.geographicCoverage = 'Geographic coverage is required';
    if (!metadata.dataSource?.trim()) newErrors.dataSource = 'Data source is required';
    if (!metadata.methodologySummary?.trim()) newErrors.methodologySummary = 'Methodology summary is required';
    if (!metadata.dataLimitations?.trim()) newErrors.dataLimitations = 'Data limitations are required';
    if (!metadata.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateMetadata()) {
      alert('Please fill in all required fields');
      return;
    }

    const now = new Date().toISOString();
    const year = new Date().getFullYear();

    // Generate filename
    const fileName = generateFileName(
      metadata.category!.replace(/^\d+_/, ''),
      metadata.datasetName!,
      year,
      1,
      metadata.format as DataFormat
    );

    const completeMetadata: GISMetadata = {
      id: crypto.randomUUID(),
      datasetName: metadata.datasetName!,
      description: metadata.description!,
      custodianAgency: metadata.custodianAgency!,
      contactPerson: metadata.contactPerson!,
      contactEmail: metadata.contactEmail!,
      contactPhone: metadata.contactPhone,
      dateCreated: metadata.dateCreated || now,
      dateUpdated: now,
      updateFrequency: metadata.updateFrequency as UpdateFrequency,
      geographicCoverage: metadata.geographicCoverage!,
      coordinateReferenceSystem: metadata.coordinateReferenceSystem!,
      geometryType: metadata.geometryType as GeometryType,
      dataSource: metadata.dataSource!,
      methodologySummary: metadata.methodologySummary!,
      dataLimitations: metadata.dataLimitations!,
      accessClassification: metadata.accessClassification as AccessClassification,
      licenseType: metadata.licenseType,
      format: metadata.format as DataFormat,
      category: metadata.category as GISCategory,
      fileName,
      fileSize: metadata.fileSize,
      featureCount: metadata.featureCount,
      keywords: metadata.keywords || [],
      language: metadata.language!,
      spatialAccuracy: metadata.spatialAccuracy,
      completeness: metadata.completeness,
      boundingBox: metadata.boundingBox
    };

    const dataset: GISDataset = {
      metadata: completeMetadata,
      data: fileData,
      uploaded: true,
      uploadedBy: metadata.contactPerson,
      uploadedAt: now
    };

    onAddDataset(dataset);

    // Reset form
    setStep(1);
    setUploadedFile(null);
    setFileData(null);
    setMetadata({
      coordinateReferenceSystem: 'EPSG:4326',
      format: 'GeoJSON',
      language: 'en',
      keywords: [],
      accessClassification: 'Public',
      updateFrequency: 'Annual'
    });
    setErrors({});

    alert('Dataset uploaded successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-700' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="font-medium">Upload File</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-4">
            <div className={`h-full ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-300'} transition-all`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-700' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="font-medium">Add Metadata</span>
          </div>
        </div>

        {/* Step 1: File Upload */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Upload Geospatial Dataset</h2>
            <p className="text-gray-600 mb-6">
              Upload your GeoJSON file to begin. The system will automatically validate the file structure.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-emerald-500 transition-colors">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />

              <label className="cursor-pointer">
                <span className="text-emerald-700 font-medium hover:text-emerald-800">
                  Choose a file
                </span>
                <span className="text-gray-600"> or drag and drop</span>
                <input
                  type="file"
                  accept=".geojson,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <p className="text-sm text-gray-500 mt-2">
                GeoJSON format only • EPSG:4326 recommended
              </p>
            </div>

            {errors.file && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errors.file}</span>
              </div>
            )}

            {uploadedFile && !errors.file && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-emerald-900">{uploadedFile.name}</p>
                  <p className="text-sm text-emerald-700">
                    {(uploadedFile.size / 1024).toFixed(1)} KB • {metadata.featureCount} features
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Metadata Form */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Dataset Metadata (ISO 19115)</h2>

            <div className="space-y-6">
              {/* Core Identification */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-4">Core Identification</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dataset Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={metadata.datasetName || ''}
                      onChange={(e) => setMetadata({ ...metadata, datasetName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.datasetName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Merremia Peltata Distribution - Efate Island"
                    />
                    {errors.datasetName && <p className="text-red-500 text-xs mt-1">{errors.datasetName}</p>}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={metadata.description || ''}
                      onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Detailed description of the dataset content and purpose..."
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={metadata.category || ''}
                      onChange={(e) => setMetadata({ ...metadata, category: e.target.value as GISCategory })}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select category...</option>
                      <option value="01_boundaries">Administrative Boundaries</option>
                      <option value="02_conservation_areas">Conservation Areas</option>
                      <option value="03_ecosystems_land">Ecosystems & Land Cover</option>
                      <option value="04_species">Species Distribution</option>
                      <option value="05_invasive_species">Invasive Species</option>
                      <option value="06_restoration">Restoration Sites</option>
                      <option value="07_production_pollution">Production & Pollution</option>
                      <option value="08_urban_green_blue">Urban Green/Blue Infrastructure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Classification <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={metadata.accessClassification || 'Public'}
                      onChange={(e) => setMetadata({ ...metadata, accessClassification: e.target.value as AccessClassification })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Public">Public</option>
                      <option value="Restricted">Restricted</option>
                      <option value="Confidential">Confidential</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Responsibility */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-4">Responsibility</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custodian Agency <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={metadata.custodianAgency || ''}
                      onChange={(e) => setMetadata({ ...metadata, custodianAgency: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.custodianAgency ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Department of Environment"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={metadata.contactPerson || ''}
                      onChange={(e) => setMetadata({ ...metadata, contactPerson: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={metadata.contactEmail || ''}
                      onChange={(e) => setMetadata({ ...metadata, contactEmail: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="email@depc.gov.vu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={metadata.contactPhone || ''}
                      onChange={(e) => setMetadata({ ...metadata, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="+678..."
                    />
                  </div>
                </div>
              </div>

              {/* Spatial & Temporal */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-4">Spatial & Temporal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Geographic Coverage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={metadata.geographicCoverage || ''}
                      onChange={(e) => setMetadata({ ...metadata, geographicCoverage: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.geographicCoverage ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Efate Island, All Vanuatu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Update Frequency <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={metadata.updateFrequency || 'Annual'}
                      onChange={(e) => setMetadata({ ...metadata, updateFrequency: e.target.value as UpdateFrequency })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                      <option value="Ad-hoc">Ad-hoc</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CRS <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={metadata.coordinateReferenceSystem || 'EPSG:4326'}
                      onChange={(e) => setMetadata({ ...metadata, coordinateReferenceSystem: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="EPSG:4326"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spatial Accuracy
                    </label>
                    <input
                      type="text"
                      value={metadata.spatialAccuracy || ''}
                      onChange={(e) => setMetadata({ ...metadata, spatialAccuracy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., ±5m"
                    />
                  </div>
                </div>
              </div>

              {/* Lineage */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-4">Lineage</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Source <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={metadata.dataSource || ''}
                      onChange={(e) => setMetadata({ ...metadata, dataSource: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.dataSource ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Field survey by DEPC officers"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Methodology Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={metadata.methodologySummary || ''}
                      onChange={(e) => setMetadata({ ...metadata, methodologySummary: e.target.value })}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.methodologySummary ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Brief description of data collection methods..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Limitations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={metadata.dataLimitations || ''}
                      onChange={(e) => setMetadata({ ...metadata, dataLimitations: e.target.value })}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.dataLimitations ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Known limitations, gaps, or constraints..."
                    />
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-4">Keywords</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add keyword..."
                  />
                  <button
                    onClick={handleAddKeyword}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {metadata.keywords?.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button
                        onClick={() => handleRemoveKeyword(idx)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Upload Dataset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Metadata Catalog View
export function MetadataCatalogView({ datasets, onDownloadMetadata }: any) {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const handleExportAll = () => {
    const metadataList = datasets.map((d: GISDataset) => d.metadata);

    if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(metadataList, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `depc-gis-metadata-catalog-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV export
      const headers = ['Dataset Name', 'Category', 'Custodian', 'Date Updated', 'Access', 'Format', 'Coverage'];
      const rows = metadataList.map((m: GISMetadata) => [
        m.datasetName,
        m.category,
        m.custodianAgency,
        new Date(m.dateUpdated).toLocaleDateString(),
        m.accessClassification,
        m.format,
        m.geographicCoverage
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `depc-gis-metadata-catalog-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Metadata Catalog</h2>
          <div className="flex items-center gap-3">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
            <button
              onClick={handleExportAll}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dataset</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Custodian</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Updated</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Access</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {datasets.map((dataset: GISDataset) => (
                <tr key={dataset.metadata.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{dataset.metadata.datasetName}</div>
                    <div className="text-sm text-gray-500">{dataset.metadata.format}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{dataset.metadata.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{dataset.metadata.custodianAgency}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(dataset.metadata.dateUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dataset.metadata.accessClassification === 'Public'
                        ? 'bg-green-100 text-green-800'
                        : dataset.metadata.accessClassification === 'Restricted'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {dataset.metadata.accessClassification}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDownloadMetadata(dataset)}
                      className="text-emerald-700 hover:text-emerald-800 font-medium text-sm"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Metadata Modal Component
export function MetadataModal({ dataset, onClose, onDownload }: any) {
  const { metadata } = dataset;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold">Dataset Metadata</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">{metadata.datasetName}</h3>
            <p className="text-gray-700">{metadata.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Category:</span>
              <p className="text-gray-900">{metadata.category}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Access:</span>
              <p className="text-gray-900">{metadata.accessClassification}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Custodian:</span>
              <p className="text-gray-900">{metadata.custodianAgency}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Contact:</span>
              <p className="text-gray-900">{metadata.contactPerson}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{metadata.contactEmail}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Coverage:</span>
              <p className="text-gray-900">{metadata.geographicCoverage}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">CRS:</span>
              <p className="text-gray-900">{metadata.coordinateReferenceSystem}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Format:</span>
              <p className="text-gray-900">{metadata.format}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Created:</span>
              <p className="text-gray-900">{new Date(metadata.dateCreated).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Updated:</span>
              <p className="text-gray-900">{new Date(metadata.dateUpdated).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-600">Data Source:</span>
            <p className="text-gray-900">{metadata.dataSource}</p>
          </div>

          <div>
            <span className="font-medium text-gray-600">Methodology:</span>
            <p className="text-gray-900">{metadata.methodologySummary}</p>
          </div>

          <div>
            <span className="font-medium text-gray-600">Limitations:</span>
            <p className="text-gray-900">{metadata.dataLimitations}</p>
          </div>

          <div>
            <span className="font-medium text-gray-600">Keywords:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {metadata.keywords.map((keyword: string, idx: number) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={() => onDownload(dataset)}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
          >
            Download Metadata
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
