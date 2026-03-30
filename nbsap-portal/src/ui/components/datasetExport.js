/**
 * Structured dataset export — GeoJSON and GeoPackage, organised by NBSAP target.
 *
 * Produces a ZIP archive with clean, structured data:
 *   NBSAP_Export_<date>/
 *     T1_Biodiversity_Spatial_Planning/
 *       CCA.geojson | CCA layer in .gpkg
 *     T3_30x30_Conservation/
 *       MPA.geojson | …
 *     …
 */
import JSZip from 'jszip';
import { buildGeoPackage } from '../../gis/geopackage.js';
import { getAppState } from '../state.js';
import { CATEGORIES } from '../../config/categories.js';
import targetConfig from '../../config/targets.js';
import { listLayers } from '../../services/storage/index.js';
import { showAlert } from './dialog.js';

const TARGETS = targetConfig.targets;

/**
 * Opens the export format dialog and triggers download.
 * Called from the Admin page "Export Data" button.
 *
 * @param {HTMLElement} statusEl  Element to show progress text.
 */
export async function openExportDialog(statusEl) {
  // Build modal
  const overlay = document.createElement('div');
  overlay.className = 'export-dialog-overlay';
  overlay.innerHTML = `
    <div class="export-dialog">
      <div class="export-dialog-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <h3>Export Structured Dataset</h3>
      </div>
      <p class="export-dialog-desc">
        Download all GIS layers organised by NBSAP target category.
        Each target folder contains its associated layers as clean, standards-compliant files.
      </p>

      <div class="export-format-options">
        <label class="export-format-card" data-format="geojson">
          <input type="radio" name="export-format" value="geojson" checked>
          <div class="export-format-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div class="export-format-label">GeoJSON</div>
          <div class="export-format-note">Universal — QGIS, ArcGIS, web apps</div>
        </label>

        <label class="export-format-card" data-format="geopackage">
          <input type="radio" name="export-format" value="geopackage">
          <div class="export-format-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
          <div class="export-format-label">GeoPackage</div>
          <div class="export-format-note">OGC standard — single .gpkg per target</div>
        </label>

        <label class="export-format-card" data-format="both">
          <input type="radio" name="export-format" value="both">
          <div class="export-format-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="18" rx="2"/>
              <line x1="12" y1="3" x2="12" y2="21"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
            </svg>
          </div>
          <div class="export-format-label">Both Formats</div>
          <div class="export-format-note">GeoJSON + GeoPackage together</div>
        </label>
      </div>

      <div class="export-dialog-actions">
        <button class="btn btn-outline" id="export-cancel">Cancel</button>
        <button class="btn btn-primary" id="export-confirm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download ZIP
        </button>
      </div>

      <div class="export-progress" id="export-progress" style="display:none">
        <div class="export-progress-bar"><div class="export-progress-fill" id="export-progress-fill"></div></div>
        <span class="export-progress-text" id="export-progress-text">Preparing...</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Interaction
  const formatCards = overlay.querySelectorAll('.export-format-card');
  formatCards.forEach(card => {
    card.addEventListener('click', () => {
      formatCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      card.querySelector('input').checked = true;
    });
  });
  // Select first by default
  formatCards[0].classList.add('selected');

  return new Promise((resolve) => {
    overlay.querySelector('#export-cancel').addEventListener('click', () => {
      overlay.remove();
      resolve(false);
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { overlay.remove(); resolve(false); }
    });

    overlay.querySelector('#export-confirm').addEventListener('click', async () => {
      const format = overlay.querySelector('input[name="export-format"]:checked').value;
      const progressEl = overlay.querySelector('#export-progress');
      const fillEl = overlay.querySelector('#export-progress-fill');
      const textEl = overlay.querySelector('#export-progress-text');
      const confirmBtn = overlay.querySelector('#export-confirm');
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Exporting...';
      progressEl.style.display = 'block';

      try {
        await runExport(format, (pct, msg) => {
          fillEl.style.width = `${pct}%`;
          textEl.textContent = msg;
          if (statusEl) statusEl.textContent = msg;
        });
        textEl.textContent = 'Download complete!';
        if (statusEl) statusEl.textContent = 'Export completed successfully';
        setTimeout(() => overlay.remove(), 800);
        resolve(true);
      } catch (err) {
        console.error('Dataset export failed:', err);
        textEl.textContent = `Error: ${err.message}`;
        if (statusEl) statusEl.textContent = `Error: ${err.message}`;
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Retry';
        resolve(false);
      }
    });
  });
}

/**
 * Core export logic. Fetches all layers, groups by target, writes ZIP.
 */
async function runExport(format, onProgress) {
  onProgress(5, 'Loading all layers from database...');

  // Load ALL layers with full GeoJSON from storage
  const allLayers = await listLayers();

  if (!allLayers || allLayers.length === 0) {
    throw new Error('No layers found to export');
  }

  onProgress(15, `Loaded ${allLayers.length} layers. Organising by target...`);

  // Group layers by target code
  const targetGroups = _groupByTarget(allLayers);
  // Also collect layers that don't belong to any target
  const ungrouped = allLayers.filter(l => {
    const targets = l.metadata?.targets || [];
    return targets.length === 0;
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  const zip = new JSZip();
  const rootFolder = zip.folder(`NBSAP_Export_${dateStr}`);

  // Add a README
  rootFolder.file('README.txt', _generateReadme(allLayers, targetGroups, dateStr, format));

  const targetCodes = Object.keys(targetGroups);
  const totalSteps = targetCodes.length + (ungrouped.length > 0 ? 1 : 0);
  let step = 0;

  // Process each target
  for (const code of targetCodes) {
    const target = TARGETS.find(t => t.code === code);
    const folderName = _targetFolderName(code, target);
    const folder = rootFolder.folder(folderName);
    const layers = targetGroups[code];

    step++;
    const pct = 20 + Math.round((step / totalSteps) * 60);
    onProgress(pct, `Processing ${code}: ${layers.length} layer(s)...`);

    if (format === 'geojson' || format === 'both') {
      for (const layer of layers) {
        const fname = _layerFileName(layer) + '.geojson';
        const cleaned = _cleanGeoJSON(layer);
        folder.file(fname, JSON.stringify(cleaned, null, 2));
      }
    }

    if (format === 'geopackage' || format === 'both') {
      const gpkgLayers = layers
        .filter(l => l.geojson?.features?.length > 0)
        .map(l => ({
          name: _layerFileName(l),
          geojson: _cleanGeoJSON(l)
        }));

      if (gpkgLayers.length > 0) {
        const gpkgBytes = await buildGeoPackage(gpkgLayers);
        folder.file(`${folderName}.gpkg`, gpkgBytes);
      }
    }
  }

  // Ungrouped layers (no target assigned)
  if (ungrouped.length > 0) {
    const folder = rootFolder.folder('Other_Uncategorised');
    step++;
    const pct = 20 + Math.round((step / totalSteps) * 60);
    onProgress(pct, `Processing uncategorised layers...`);

    if (format === 'geojson' || format === 'both') {
      for (const layer of ungrouped) {
        const fname = _layerFileName(layer) + '.geojson';
        const cleaned = _cleanGeoJSON(layer);
        folder.file(fname, JSON.stringify(cleaned, null, 2));
      }
    }

    if (format === 'geopackage' || format === 'both') {
      const gpkgLayers = ungrouped
        .filter(l => l.geojson?.features?.length > 0)
        .map(l => ({
          name: _layerFileName(l),
          geojson: _cleanGeoJSON(l)
        }));

      if (gpkgLayers.length > 0) {
        const gpkgBytes = await buildGeoPackage(gpkgLayers);
        folder.file('Other_Uncategorised.gpkg', gpkgBytes);
      }
    }
  }

  onProgress(85, 'Compressing ZIP archive...');

  const blob = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (meta) => {
      const pct = 85 + Math.round(meta.percent * 0.14);
      onProgress(pct, `Compressing... ${Math.round(meta.percent)}%`);
    }
  );

  onProgress(99, 'Starting download...');

  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NBSAP_Export_${dateStr}_${format}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  onProgress(100, 'Download complete!');
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Groups layers by their target code(s). A layer can appear under multiple targets. */
function _groupByTarget(layers) {
  const groups = {};
  for (const layer of layers) {
    const targets = layer.metadata?.targets || [];
    for (const t of targets) {
      if (!groups[t]) groups[t] = [];
      groups[t].push(layer);
    }
  }
  // Sort target codes in natural order (T1, T2, T3, ...)
  const sorted = {};
  Object.keys(groups).sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const nb = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return na - nb;
  }).forEach(k => { sorted[k] = groups[k]; });
  return sorted;
}

/** Builds a folder-safe name like "T3_30x30_Conservation". */
function _targetFolderName(code, target) {
  if (!target) return code;
  // Extract short name from "Target N: Short Name"
  const short = target.name.replace(/^Target \d+:\s*/, '').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_');
  return `${code}_${short}`;
}

/** Builds a safe filename from the layer's category and name. */
function _layerFileName(layer) {
  const cat = layer.metadata?.category || 'unknown';
  const name = layer.metadata?.name || layer.id;
  const catLabel = CATEGORIES[cat]?.label || cat;
  return catLabel.replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, '_').substring(0, 60);
}

/**
 * Creates a clean GeoJSON FeatureCollection with standardised properties
 * and full metadata in the FeatureCollection-level properties.
 */
function _cleanGeoJSON(layer) {
  const meta = layer.metadata || {};
  const features = (layer.geojson?.features || []).map(f => {
    const p = f.properties || {};
    return {
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        name: p.name || '',
        type: p.type || '',
        realm: p.realm || meta.realm || '',
        province: p.province || '',
        status: p.status || '',
        year: p.year || null,
        area_ha: p.area_ha != null ? Math.round(p.area_ha * 100) / 100 : null,
        targets: (p.targets || meta.targets || []).join(';'),
        source: p.source || '',
        notes: p.notes || '',
        species: p.species || null,
        coverage_category: p.coverage_category || null,
        threat_level: p.threat_level || null
      }
    };
  });

  // Remove null-only fields across all features for cleanliness
  const keysToCheck = ['species', 'coverage_category', 'threat_level', 'year'];
  for (const key of keysToCheck) {
    const allNull = features.every(f => f.properties[key] == null || f.properties[key] === '');
    if (allNull) {
      for (const f of features) delete f.properties[key];
    }
  }

  return {
    type: 'FeatureCollection',
    name: meta.name || '',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4326' } },
    metadata: {
      category: meta.category || '',
      categoryLabel: CATEGORIES[meta.category]?.label || meta.category || '',
      targets: meta.targets || [],
      realm: meta.realm || '',
      featureCount: features.length,
      totalAreaHa: meta.totalAreaHa || 0,
      exportDate: new Date().toISOString(),
      source: 'Vanuatu NBSAP GIS Data Portal',
      description: meta.description || '',
      custodianAgency: meta.custodianAgency || 'DEPC',
      accessClassification: meta.accessClassification || 'Public'
    },
    features
  };
}

/** Generates a README for the export archive. */
function _generateReadme(allLayers, targetGroups, dateStr, format) {
  const lines = [
    '=================================================================',
    '  Vanuatu NBSAP GIS Data Export',
    '  Department of Environmental Protection & Conservation (DEPC)',
    '=================================================================',
    '',
    `  Export Date:    ${dateStr}`,
    `  Format:         ${format === 'both' ? 'GeoJSON + GeoPackage' : format === 'geopackage' ? 'GeoPackage (.gpkg)' : 'GeoJSON'}`,
    `  Total Layers:   ${allLayers.length}`,
    `  CRS:            EPSG:4326 (WGS 84)`,
    '',
    '  This archive contains spatial datasets from the Vanuatu NBSAP',
    '  GIS Portal, organised by NBSAP/GBF target category.',
    '',
    '-----------------------------------------------------------------',
    '  FOLDER STRUCTURE',
    '-----------------------------------------------------------------',
    ''
  ];

  for (const [code, layers] of Object.entries(targetGroups)) {
    const target = TARGETS.find(t => t.code === code);
    const name = target ? target.name : code;
    lines.push(`  ${_targetFolderName(code, target)}/`);
    lines.push(`    ${name}`);
    for (const l of layers) {
      const cat = CATEGORIES[l.metadata?.category]?.label || l.metadata?.category || '?';
      const n = l.geojson?.features?.length || 0;
      lines.push(`    - ${cat} (${n} features)`);
    }
    lines.push('');
  }

  lines.push(
    '-----------------------------------------------------------------',
    '  USAGE',
    '-----------------------------------------------------------------',
    '',
    '  GeoJSON files can be opened in:',
    '    - QGIS (drag & drop)',
    '    - ArcGIS Pro (Add Data)',
    '    - geojson.io, Mapbox, Leaflet, Google Earth',
    '',
    '  GeoPackage (.gpkg) files can be opened in:',
    '    - QGIS (drag & drop — recommended)',
    '    - ArcGIS Pro (Add Data)',
    '    - Any OGC-compliant GIS application',
    '',
    '  All coordinates are in WGS 84 (EPSG:4326).',
    '  Area values (area_ha) are geodesic hectares.',
    '',
    '=================================================================',
    '  Generated by the Vanuatu NBSAP GIS Data Portal',
    '  https://welinrj.github.io/merremia-vanuatu-dashboard/nbsap-portal/',
    '================================================================='
  );

  return lines.join('\n');
}
