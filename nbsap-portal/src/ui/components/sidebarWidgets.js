/**
 * Sidebar widgets: Priority Targets and Latest Activity.
 */
import targetsConfig from '../../config/targets.js';
import { getDashboardLayers, updateFilters } from '../state.js';
import { getAuditLog } from '../../services/storage/index.js';

let _priorityRendered = false;
let _priorityLayerCount = -1;

/** Reset so widgets re-render on next refresh (call after layer changes). */
export function invalidatePriorityCache() {
  _priorityRendered = false;
  _priorityLayerCount = -1;
}

/**
 * Renders "Priority Targets" — targets ranked by data gap.
 * Skips re-rendering unless layer count changes.
 */
export function renderPriorityTargets(container) {
  const layers = getDashboardLayers();

  // Skip if already rendered and layer count unchanged
  if (_priorityRendered && layers.length === _priorityLayerCount) return;
  _priorityLayerCount = layers.length;

  // Count layers per target
  const targetStats = targetsConfig.targets.map(t => {
    const matching = layers.filter(l =>
      l.metadata?.targets?.includes(t.code)
    );
    return { code: t.code, name: t.name, color: t.color, layerCount: matching.length };
  });

  // Sort: fewest layers first (biggest gap = highest priority)
  const sorted = [...targetStats].sort((a, b) => a.layerCount - b.layerCount);

  // Show top 4 priority targets
  const top = sorted.slice(0, 4);

  const items = top.map(t => {
    const status = t.layerCount === 0
      ? { label: 'No data', cls: 'priority-critical' }
      : t.layerCount <= 2
        ? { label: `${t.layerCount} dataset${t.layerCount > 1 ? 's' : ''}`, cls: 'priority-low' }
        : { label: `${t.layerCount} datasets`, cls: 'priority-ok' };
    return `
      <div class="priority-item" data-target="${t.code}" title="Click to view ${t.code}">
        <span class="priority-dot" style="background:${t.color}"></span>
        <span class="priority-code">${t.code}</span>
        <span class="priority-status ${status.cls}">${status.label}</span>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="sidebar-section-title" style="margin-top:8px">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      Priority Targets
    </div>
    <div class="priority-list">${items}</div>
  `;

  // Click to navigate to target
  container.querySelectorAll('.priority-item').forEach(el => {
    el.addEventListener('click', () => {
      updateFilters({ targets: [el.dataset.target] });
    });
  });

  _priorityRendered = true;
}

/** Cached activity entries — only fetched once, refreshed on layer changes. */
let _activityCache = null;
let _activityRendered = false;

/** Call this to invalidate the activity cache (e.g. after upload). */
export function invalidateActivityCache() {
  _activityCache = null;
  _activityRendered = false;
}

/**
 * Renders "Latest Activity" — most recent audit log entries.
 * Skips re-rendering if already populated (global data, not filter-dependent).
 */
export function renderLatestActivity(container) {
  // Skip if already rendered and cache is valid
  if (_activityRendered) return;

  // Show placeholder
  container.innerHTML = `
    <div class="sidebar-section-title" style="margin-top:8px">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      Latest Activity
    </div>
    <div class="activity-list"><span class="activity-loading">Loading&hellip;</span></div>
  `;

  // Fetch async but don't block the refresh cycle
  _fetchAndRenderActivity(container);
}

async function _fetchAndRenderActivity(container) {
  let entries = _activityCache;

  if (!entries) {
    try {
      const log = await getAuditLog();
      entries = (log || []).slice(0, 5);
    } catch (_) {
      entries = [];
    }

    // Fallback to layer upload timestamps
    if (entries.length === 0) {
      const layers = getDashboardLayers();
      entries = layers
        .filter(l => l.metadata?.uploadTimestamp)
        .map(l => ({
          action: 'upload',
          timestamp: l.metadata.uploadTimestamp,
          filename: l.metadata.originalFilename || l.metadata.name,
          category: l.metadata.category
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    }

    _activityCache = entries;
  }

  const listEl = container.querySelector('.activity-list');
  if (!listEl) return;

  if (entries.length === 0) {
    listEl.innerHTML = '<div class="activity-empty">No activity recorded yet</div>';
    _activityRendered = true;
    return;
  }

  listEl.innerHTML = entries.map(e => {
    const actionInfo = ACTION_LABELS[e.action] || ACTION_LABELS.default;
    const timeStr = formatRelativeTime(e.timestamp);
    const detail = e.filename || e.category || '';
    return `
      <div class="activity-item">
        <span class="activity-icon" style="color:${actionInfo.color}">${actionInfo.icon}</span>
        <div class="activity-body">
          <span class="activity-action">${actionInfo.label}</span>
          ${detail ? `<span class="activity-detail" title="${detail}">${truncate(detail, 28)}</span>` : ''}
        </div>
        <span class="activity-time" title="${e.timestamp || ''}">${timeStr}</span>
      </div>`;
  }).join('');

  _activityRendered = true;
}

const ACTION_LABELS = {
  upload:        { label: 'Uploaded',  icon: svgIcon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'), color: '#2E7D32' },
  replace:       { label: 'Replaced',  icon: svgIcon('<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.58-4.7"/>'), color: '#1565C0' },
  delete:        { label: 'Deleted',   icon: svgIcon('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'), color: '#C62828' },
  export_backup: { label: 'Exported',  icon: svgIcon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'), color: '#795548' },
  sync_import:   { label: 'Imported',  icon: svgIcon('<path d="M16 16v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1"/><rect x="8" y="2" width="13" height="13" rx="2"/>'), color: '#7E57C2' },
  import_backup: { label: 'Restored',  icon: svgIcon('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'), color: '#D84315' },
  default:       { label: 'Activity',  icon: svgIcon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'), color: '#78909C' }
};

function svgIcon(path) {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${path}</svg>`;
}

function formatRelativeTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + '\u2026' : str;
}
