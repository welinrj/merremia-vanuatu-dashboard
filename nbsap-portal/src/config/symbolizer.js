/**
 * Layer style override store.
 *
 * Stores user-defined symbology overrides per layer ID and persists them in
 * localStorage so customisations survive page refreshes.
 *
 * Override object shape:
 *   mode: 'single' | 'categorized'
 *
 *   Single mode — applies one style to all features:
 *     fillColor: '#hex'
 *     strokeColor: '#hex'
 *     fillOpacity: 0–1
 *     weight: stroke-width in pixels
 *     dashArray: null | '8 4' | '6 4' | '2 4' | …
 *     pointRadius: pixels (point layers only)
 *     fillTransparent: boolean — no fill (fill: false)
 *     strokeTransparent: boolean — no stroke (stroke: false, weight: 0)
 *
 *   Categorized mode — different fill/stroke per type or status value:
 *     categoryBy: 'type' | 'status'
 *     categoryColors: { 'TypeName': { fillColor, strokeColor }, … }
 */

const STORAGE_KEY = 'nbsap_layer_styles_v1';

let _styles = {};

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) _styles = JSON.parse(raw);
} catch (_) {}

function _save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_styles)); } catch (_) {}
}

/** Returns the style override for a layer, or null if none set. */
export function getLayerStyle(layerId) {
  return _styles[layerId] || null;
}

/** Saves a style override for a layer and persists to localStorage. */
export function setLayerStyle(layerId, styleObj) {
  _styles[layerId] = styleObj;
  _save();
}

/** Removes the style override for a layer (reverts to default symbology). */
export function resetLayerStyle(layerId) {
  delete _styles[layerId];
  _save();
}

/** Returns true if the layer has a user-defined style override. */
export function hasLayerStyle(layerId) {
  return !!_styles[layerId];
}

/**
 * Merges a style override into a base Leaflet polygon style object.
 *
 * For categorized overrides, pass the feature's type or status value so the
 * correct per-category colour is applied.  If no category match is found the
 * base style is returned unchanged.
 *
 * @param {object} baseStyle   - Leaflet GeoJSON style options
 * @param {object|null} override - Override from getLayerStyle()
 * @param {string} [featureTypeValue] - Feature's type or status value (categorized mode)
 * @returns {object} Merged style
 */
export function applyStyleOverride(baseStyle, override, featureTypeValue) {
  if (!override) return baseStyle;

  if (override.mode === 'categorized' && override.categoryColors) {
    const catColors = override.categoryColors[featureTypeValue];
    if (catColors) {
      return {
        ...baseStyle,
        ...(catColors.fillColor  && { fillColor: catColors.fillColor }),
        ...(catColors.strokeColor && { color:     catColors.strokeColor }),
      };
    }
    return baseStyle;
  }

  // Single mode
  const merged = { ...baseStyle };
  if (override.fillTransparent) {
    merged.fill        = false;
    merged.fillOpacity = 0;
  } else {
    if (override.fillColor)               merged.fillColor   = override.fillColor;
    if (override.fillOpacity !== undefined) merged.fillOpacity = override.fillOpacity;
  }
  if (override.strokeTransparent) {
    merged.stroke = false;
    merged.weight  = 0;
  } else {
    if (override.strokeColor)             merged.color  = override.strokeColor;
    if (override.weight !== undefined)    merged.weight = override.weight;
  }
  if (override.dashArray !== undefined)   merged.dashArray = override.dashArray || null;
  return merged;
}

/**
 * Merges a style override into a base Leaflet circleMarker options object.
 * Same semantics as applyStyleOverride but also handles pointRadius → radius.
 */
export function applyPointStyleOverride(baseStyle, override, featureTypeValue) {
  if (!override) return baseStyle;

  if (override.mode === 'categorized' && override.categoryColors) {
    const catColors = override.categoryColors[featureTypeValue];
    if (catColors) {
      return {
        ...baseStyle,
        ...(catColors.fillColor  && { fillColor: catColors.fillColor }),
        ...(catColors.strokeColor && { color:    catColors.strokeColor }),
      };
    }
    return baseStyle;
  }

  // Single mode
  const merged = { ...baseStyle };
  if (override.fillTransparent) {
    merged.fill        = false;
    merged.fillOpacity = 0;
  } else {
    if (override.fillColor)               merged.fillColor   = override.fillColor;
    if (override.fillOpacity !== undefined) merged.fillOpacity = override.fillOpacity;
  }
  if (override.strokeTransparent) {
    merged.stroke = false;
    merged.weight  = 0;
  } else {
    if (override.strokeColor)             merged.color  = override.strokeColor;
    if (override.weight !== undefined)    merged.weight = override.weight;
  }
  if (override.pointRadius !== undefined) merged.radius = override.pointRadius;
  return merged;
}
