/**
 * Professional Map Export Template
 *
 * Produces an A4-landscape PNG (1587 × 1123 px @ 2× DPR = 3174 × 2246 actual pixels)
 * with a government-grade cartographic layout:
 *
 *  ┌─────────────────────────────────────────────────────────┐
 *  │ HEADER — Coat of Arms · DEPC logo · CBD logo · Title   │
 *  ├──────────────────────────────────────┬──────────────────┤
 *  │  MAP AREA (tiles + vector overlays)  │  SIDEBAR         │
 *  │                                      │  Legend          │
 *  │                                      │  North Arrow     │
 *  │                                      │  Scale Bar       │
 *  │                                      │  Map Info        │
 *  ├──────────────────────────────────────┴──────────────────┤
 *  │ FOOTER — Source · Date · Disclaimer · VSS footnote     │
 *  └─────────────────────────────────────────────────────────┘
 */

// ── Template geometry ─────────────────────────────────────────────────────────
const W          = 1587;   // A4 landscape at ~144 DPI
const H          = 1123;
const PAD        = 12;
const HEADER_H   = 100;
const FOOTER_H   = 110;
const SIDEBAR_W  = 264;
const DPR        = 2;      // retina quality output

// Derived zones
const MAP_X  = PAD;
const MAP_Y  = HEADER_H + PAD;
const MAP_W  = W - SIDEBAR_W - PAD * 3;
const MAP_H  = H - HEADER_H - FOOTER_H - PAD * 2;
const SIDE_X = MAP_X + MAP_W + PAD;
const SIDE_Y = MAP_Y;
const SIDE_W = W - SIDE_X - PAD;
const SIDE_H = MAP_H;
const FOOT_Y = MAP_Y + MAP_H + PAD;

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  headerBg:    '#004D2C',
  headerBg2:   '#006B3F',
  headerText:  '#FFFFFF',
  accent:      '#006B3F',
  accentLight: '#e6f4ee',
  border:      '#CBD2D9',
  borderDark:  '#3E4C59',
  sidebarBg:   '#F8FAFB',
  footerBg:    '#F1F3F5',
  footerText:  '#3E4C59',
  text:        '#1A202C',
  textSec:     '#616E7C',
  textTer:     '#9AA5B4',
  mapBorder:   '#2D3748',
};

// ── Public base path helper ───────────────────────────────────────────────────
function _base() {
  const p = window.location.pathname;
  return p.substring(0, p.lastIndexOf('/') + 1);
}

// ── Image loaders ─────────────────────────────────────────────────────────────

function _loadImg(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);  // silent — missing logo just leaves gap
    img.src = src;
  });
}

// ── Canvas helpers ────────────────────────────────────────────────────────────

function _roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function _text(ctx, str, x, y, opts = {}) {
  const {
    size = 12, weight = 'normal', color = C.text,
    align = 'left', maxWidth
  } = opts;
  ctx.font        = `${weight} ${size}px 'Segoe UI', Arial, sans-serif`;
  ctx.fillStyle   = color;
  ctx.textAlign   = align;
  ctx.textBaseline = 'top';
  if (maxWidth) ctx.fillText(str, x, y, maxWidth);
  else          ctx.fillText(str, x, y);
}

function _wrapText(ctx, str, x, y, maxW, lineH, opts = {}) {
  const words = str.split(' ');
  let line = '';
  let curY = y;
  const { size = 11, color = C.textSec, weight = 'normal' } = opts;
  ctx.font      = `${weight} ${size}px 'Segoe UI', Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, curY, maxW);
      line = word;
      curY += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, curY, maxW);
  return curY + lineH;
}

// ── Section divider ───────────────────────────────────────────────────────────
function _divider(ctx, x, y, w, color = C.border) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.strokeStyle = color;
  ctx.lineWidth   = 0.75;
  ctx.stroke();
}

// ── HEADER ────────────────────────────────────────────────────────────────────
function _drawHeader(ctx, coaImg, depcImg, cbdImg, title, subtitle) {
  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, HEADER_H);
  grad.addColorStop(0, C.headerBg);
  grad.addColorStop(1, C.headerBg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, HEADER_H);

  // Bottom border stripe
  ctx.fillStyle = '#E5A100';
  ctx.fillRect(0, HEADER_H - 3, W, 3);

  // ── Logos (left side) ─────────────────────────────────────────────────────
  const LOGO_H  = 72;
  const LOGO_GAP = 10;
  let logoX = 16;
  const logoY = (HEADER_H - 3 - LOGO_H) / 2;

  const logos = [coaImg, depcImg, cbdImg];
  for (const img of logos) {
    if (img) {
      const ratio = img.naturalWidth / img.naturalHeight || 1;
      const lw    = Math.round(LOGO_H * ratio);
      // Slight white background circle for visibility
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.arc(logoX + lw / 2, logoY + LOGO_H / 2, LOGO_H / 2 + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(img, logoX, logoY, lw, LOGO_H);
      logoX += lw + LOGO_GAP;
    }
  }

  // ── Title (right of logos) ────────────────────────────────────────────────
  const titleX = logoX + 16;
  const titleW = W - titleX - 24;

  // Organisation label
  _text(ctx, 'REPUBLIC OF VANUATU  ·  KUNMING-MONTREAL GLOBAL BIODIVERSITY FRAMEWORK', titleX, 10, {
    size: 8.5, weight: '600', color: 'rgba(255,255,255,0.65)', align: 'left'
  });

  // Main title
  _text(ctx, title, titleX, 22, {
    size: 20, weight: '700', color: C.headerText, maxWidth: titleW
  });

  // Subtitle
  if (subtitle) {
    _text(ctx, subtitle, titleX, 48, {
      size: 12, weight: 'normal', color: 'rgba(255,255,255,0.80)', maxWidth: titleW
    });
  }

  // NBSAP badge
  const badgeText = 'NBSAP GIS DATA PORTAL  |  VANUATU DEPC';
  ctx.font      = '700 9px Segoe UI, Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.textAlign = 'left';
  ctx.fillText(badgeText, titleX, 70);
}

// ── MAP AREA ──────────────────────────────────────────────────────────────────
async function _drawMapArea(ctx, leafletMap, mapEl) {
  // Clip to map frame
  ctx.save();
  ctx.beginPath();
  ctx.rect(MAP_X, MAP_Y, MAP_W, MAP_H);
  ctx.clip();

  // Ocean background (visible if tiles fail)
  ctx.fillStyle = '#cde8f5';
  ctx.fillRect(MAP_X, MAP_Y, MAP_W, MAP_H);

  const mapPane      = mapEl.querySelector('.leaflet-map-pane');
  const mapTransform = _parseTransform(mapPane);

  // Scale factor: template map zone vs display map
  const dispW = mapEl.offsetWidth  || 1;
  const dispH = mapEl.offsetHeight || 1;
  const scaleX = MAP_W / dispW;
  const scaleY = MAP_H / dispH;
  const scale  = Math.min(scaleX, scaleY);

  // Offset to centre the scaled map in the template zone
  const offX = MAP_X + (MAP_W - dispW * scale) / 2;
  const offY = MAP_Y + (MAP_H - dispH * scale) / 2;

  ctx.translate(offX, offY);
  ctx.scale(scale, scale);

  // ── Tile images (reload with crossOrigin) ────────────────────────────────
  const tilePane = mapEl.querySelector('.leaflet-tile-pane');
  if (tilePane) {
    const loads = [];
    for (const container of tilePane.querySelectorAll('.leaflet-tile-container')) {
      const cT = _parseTransform(container);
      for (const tile of container.querySelectorAll('img.leaflet-tile')) {
        if (!tile.src || tile.naturalWidth === 0) continue;
        const tT = _parseTransform(tile);
        const x  = mapTransform.x + cT.x + tT.x;
        const y  = mapTransform.y + cT.y + tT.y;
        const w  = tile.width  || 256;
        const h  = tile.height || 256;
        loads.push(_loadImg(tile.src).then(img => img ? { img, x, y, w, h } : null));
      }
    }
    const tiles = await Promise.all(loads);
    for (const t of tiles) {
      if (!t) continue;
      try { ctx.drawImage(t.img, t.x, t.y, t.w, t.h); } catch (_) { /* skip */ }
    }
  }

  // ── Vector canvas overlays ───────────────────────────────────────────────
  const overlayPane = mapEl.querySelector('.leaflet-overlay-pane');
  for (const cvs of mapEl.querySelectorAll('.leaflet-overlay-pane canvas')) {
    if (!cvs.width || !cvs.height) continue;
    try {
      const pT = _parseTransform(overlayPane);
      const cT = _parseTransform(cvs);
      ctx.drawImage(cvs, mapTransform.x + pT.x + cT.x, mapTransform.y + pT.y + cT.y);
    } catch (_) { /* skip */ }
  }

  // ── SVG overlays ─────────────────────────────────────────────────────────
  const mapRect = mapEl.getBoundingClientRect();
  for (const svg of mapEl.querySelectorAll('.leaflet-overlay-pane svg')) {
    try {
      const blob   = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
      const url    = URL.createObjectURL(blob);
      const img    = await _loadImg(url);
      URL.revokeObjectURL(url);
      const r = svg.getBoundingClientRect();
      if (img) ctx.drawImage(img, r.left - mapRect.left, r.top - mapRect.top, r.width, r.height);
    } catch (_) { /* skip */ }
  }

  ctx.restore();

  // Map frame border
  ctx.strokeStyle = C.mapBorder;
  ctx.lineWidth   = 1.5;
  ctx.strokeRect(MAP_X + 0.75, MAP_Y + 0.75, MAP_W - 1.5, MAP_H - 1.5);
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function _drawSidebar(ctx, leafletMap, layers) {
  // Background
  ctx.fillStyle = C.sidebarBg;
  ctx.fillRect(SIDE_X, SIDE_Y, SIDE_W, SIDE_H);
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(SIDE_X + 0.5, SIDE_Y + 0.5, SIDE_W - 1, SIDE_H - 1);

  let curY = SIDE_Y + 10;
  const iX = SIDE_X + 10;
  const iW = SIDE_W - 20;

  // ── LEGEND ────────────────────────────────────────────────────────────────
  _sectionLabel(ctx, 'LEGEND', iX, curY); curY += 18;

  if (layers && layers.length > 0) {
    for (const layer of layers) {
      if (curY > SIDE_Y + SIDE_H - 220) break; // stop before north arrow zone

      const sym = layer.symbol || 'polygon';
      const col = layer.color  || '#006B3F';

      // Symbol
      if (sym === 'point') {
        ctx.beginPath();
        ctx.arc(iX + 6, curY + 6, 5, 0, Math.PI * 2);
        ctx.fillStyle   = col;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth   = 0.75;
        ctx.stroke();
      } else {
        ctx.fillStyle   = col + '55';
        ctx.strokeStyle = col;
        ctx.lineWidth   = 1.5;
        ctx.fillRect(iX, curY + 1, 14, 10);
        ctx.strokeRect(iX, curY + 1, 14, 10);
      }

      // Label
      ctx.font      = '500 10px Segoe UI, Arial, sans-serif';
      ctx.fillStyle = C.text;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      // Truncate if too long
      let label = layer.label || layer.name || 'Layer';
      ctx.fillText(label, iX + 18, curY + 1, iW - 20);

      // Area sub-label
      if (layer.area_ha) {
        ctx.font      = 'italic 9px Segoe UI, Arial, sans-serif';
        ctx.fillStyle = C.textSec;
        ctx.fillText(_fmtHa(layer.area_ha) + ' ha', iX + 18, curY + 12, iW - 20);
        curY += 26;
      } else {
        curY += 18;
      }
    }
  } else {
    ctx.font      = 'italic 10px Segoe UI, Arial, sans-serif';
    ctx.fillStyle = C.textTer;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('No layers loaded', iX, curY);
    curY += 16;
  }

  curY += 8;
  _divider(ctx, iX, curY, iW); curY += 12;

  // ── NORTH ARROW ───────────────────────────────────────────────────────────
  _sectionLabel(ctx, 'ORIENTATION', iX, curY); curY += 14;
  _drawNorthArrow(ctx, SIDE_X + SIDE_W / 2, curY + 42);
  curY += 98;

  _divider(ctx, iX, curY, iW); curY += 12;

  // ── SCALE BAR ────────────────────────────────────────────────────────────
  _sectionLabel(ctx, 'SCALE', iX, curY); curY += 14;
  _drawScaleBar(ctx, leafletMap, iX, curY, iW);
  curY += 40;

  _divider(ctx, iX, curY, iW); curY += 12;

  // ── MAP INFORMATION ───────────────────────────────────────────────────────
  _sectionLabel(ctx, 'MAP INFORMATION', iX, curY); curY += 14;
  const info = [
    ['CRS',        'WGS 84 (EPSG:4326)'],
    ['Datum',      'World Geodetic System 1984'],
    ['Projection', 'Geographic (Lat/Long)'],
    ['Coverage',   'Vanuatu EEZ'],
    ['Standard',   'Vanuatu Spatial Data Std.'],
  ];
  for (const [k, v] of info) {
    ctx.font      = '700 9px Segoe UI, Arial, sans-serif';
    ctx.fillStyle = C.textSec;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(k.toUpperCase(), iX, curY);
    ctx.font      = '400 9px Segoe UI, Arial, sans-serif';
    ctx.fillStyle = C.text;
    ctx.fillText(v, iX + 72, curY, iW - 74);
    curY += 13;
  }
}

// ── Section label ─────────────────────────────────────────────────────────────
function _sectionLabel(ctx, label, x, y) {
  ctx.font      = '700 9px Segoe UI, Arial, sans-serif';
  ctx.fillStyle = C.accent;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(label, x, y);
}

// ── North Arrow ───────────────────────────────────────────────────────────────
function _drawNorthArrow(ctx, cx, cy) {
  const R = 28; // outer radius

  // Outer circle (subtle)
  ctx.beginPath();
  ctx.arc(cx, cy, R + 4, 0, Math.PI * 2);
  ctx.strokeStyle = C.border;
  ctx.lineWidth   = 1;
  ctx.stroke();

  // Cardinal tick marks
  ctx.strokeStyle = C.textSec;
  ctx.lineWidth   = 1;
  for (let a = 0; a < 360; a += 45) {
    const rad = (a - 90) * Math.PI / 180;
    const len = a % 90 === 0 ? 6 : 3;
    ctx.beginPath();
    ctx.moveTo(cx + (R) * Math.cos(rad), cy + (R) * Math.sin(rad));
    ctx.lineTo(cx + (R + len) * Math.cos(rad), cy + (R + len) * Math.sin(rad));
    ctx.stroke();
  }

  // Arrow — north half (solid dark)
  ctx.beginPath();
  ctx.moveTo(cx, cy - R);         // tip
  ctx.lineTo(cx + 7, cy + 4);     // right base
  ctx.lineTo(cx, cy + 1);         // centre
  ctx.closePath();
  ctx.fillStyle = C.borderDark;
  ctx.fill();

  // Arrow — south half (white)
  ctx.beginPath();
  ctx.moveTo(cx, cy + R);         // tip
  ctx.lineTo(cx - 7, cy + 4);     // left base
  ctx.lineTo(cx, cy + 1);         // centre
  ctx.closePath();
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = C.borderDark;
  ctx.lineWidth   = 0.75;
  ctx.stroke();

  // South dark half
  ctx.beginPath();
  ctx.moveTo(cx, cy + R);
  ctx.lineTo(cx + 7, cy + 4);
  ctx.lineTo(cx, cy + 1);
  ctx.closePath();
  ctx.fillStyle = C.borderDark;
  ctx.fill();

  // N label
  ctx.font         = '800 13px Segoe UI, Arial, sans-serif';
  ctx.fillStyle    = C.borderDark;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('N', cx, cy - R - 4);
}

// ── Scale Bar ─────────────────────────────────────────────────────────────────
function _drawScaleBar(ctx, leafletMap, x, y, maxW) {
  // Meters per pixel at map centre
  const zoom   = leafletMap.getZoom();
  const centre = leafletMap.getCenter();
  const mpp    = 156543.03392 * Math.cos(centre.lat * Math.PI / 180) / Math.pow(2, zoom);

  // Target bar ~60% of sidebar width in template pixels
  const targetPx = maxW * 0.75;
  const targetM  = mpp * targetPx * (mapEl_W / MAP_W); // map display px → metres

  // Round to a nice value
  const nice = _niceScale(targetM);
  const barPxDisplay = nice / mpp;             // pixels in display map
  const barPxTemplate = barPxDisplay * (MAP_W / mapEl_W); // scale to template
  const barW = Math.min(Math.round(barPxTemplate), maxW - 4);

  const bY = y + 6;
  const TICK_H = 8;

  // Draw alternating black/white bar
  const halves = 2;
  const segW   = barW / halves;
  for (let i = 0; i < halves; i++) {
    ctx.fillStyle = i % 2 === 0 ? C.borderDark : '#fff';
    ctx.strokeStyle = C.borderDark;
    ctx.lineWidth = 0.75;
    ctx.fillRect(x + i * segW, bY, segW, TICK_H);
    ctx.strokeRect(x + i * segW, bY, segW, TICK_H);
  }

  // End ticks
  ctx.strokeStyle = C.borderDark;
  ctx.lineWidth   = 1;
  ctx.beginPath(); ctx.moveTo(x, bY - 3); ctx.lineTo(x, bY + TICK_H + 1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + barW, bY - 3); ctx.lineTo(x + barW, bY + TICK_H + 1); ctx.stroke();

  // Labels
  ctx.font         = '600 9px Segoe UI, Arial, sans-serif';
  ctx.fillStyle    = C.text;
  ctx.textAlign    = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('0', x, bY + TICK_H + 3);
  ctx.textAlign = 'right';
  ctx.fillText(_fmtDistance(nice), x + barW, bY + TICK_H + 3);
}

// Stores display map width so scale bar can convert pixel scales
let mapEl_W = 800; // updated at export time

// ── FOOTER ────────────────────────────────────────────────────────────────────
function _drawFooter(ctx, vssImg, source, date, disclaimer) {
  // Background
  ctx.fillStyle = C.footerBg;
  ctx.fillRect(0, FOOT_Y, W, H - FOOT_Y);

  // Top border line
  ctx.fillStyle = C.accent;
  ctx.fillRect(0, FOOT_Y, W, 2);

  const fX  = 16;
  const fX2 = W / 2 + 8;
  let   fY  = FOOT_Y + 10;

  // Left column
  _text(ctx, 'SOURCE', fX, fY, { size: 8, weight: '700', color: C.accent });
  fY += 13;
  _wrapText(ctx, source, fX, fY, W / 2 - 24, 13, { size: 10, color: C.footerText });
  fY += 26;

  _text(ctx, 'DISCLAIMER', fX, fY, { size: 8, weight: '700', color: C.accent });
  fY += 13;
  _wrapText(ctx, disclaimer, fX, fY, W / 2 - 24, 12, { size: 9.5, color: C.textSec });

  // Right column — date, CRS, coordinate
  let rY = FOOT_Y + 10;
  _text(ctx, 'DATE', fX2, rY, { size: 8, weight: '700', color: C.accent });
  rY += 13;
  _text(ctx, date, fX2, rY, { size: 11, weight: '600', color: C.footerText });
  rY += 20;
  _text(ctx, 'COORDINATE REFERENCE SYSTEM', fX2, rY, { size: 8, weight: '700', color: C.accent });
  rY += 13;
  _text(ctx, 'WGS 84 (EPSG:4326)  ·  Geographic Lat/Long', fX2, rY, { size: 10, color: C.footerText });
  rY += 18;
  _text(ctx, 'CLASSIFICATION', fX2, rY, { size: 8, weight: '700', color: C.accent });
  rY += 13;
  _text(ctx, 'UNCLASSIFIED — For Planning Purposes Only', fX2, rY, { size: 10, color: C.footerText });

  // ── Developer footnote ───────────────────────────────────────────────────
  const fnY = H - 20;
  _divider(ctx, 16, fnY - 8, W - 32, C.border);

  // VSS logo (if available)
  const logoH = 16;
  let   logoW = 0;
  if (vssImg) {
    logoW = Math.round(logoH * (vssImg.naturalWidth / vssImg.naturalHeight));
    ctx.globalAlpha = 0.35;
    ctx.drawImage(vssImg, W - logoW - 16, fnY - 1, logoW, logoH);
    ctx.globalAlpha = 1;
  }

  ctx.font         = 'italic 9px Segoe UI, Arial, sans-serif';
  ctx.fillStyle    = 'rgba(100,116,139,0.4)';
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('developed by  VANUA SPATIAL SOLUTIONS', W - logoW - (logoW ? 8 : 16), fnY + 7);

  // © copyright line (left)
  ctx.textAlign = 'left';
  ctx.fillText(
    `© ${new Date().getFullYear()} Republic of Vanuatu — Department of Environmental Protection & Conservation`,
    16, fnY + 7
  );
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function _parseTransform(el) {
  if (!el) return { x: 0, y: 0 };
  const st   = el.style?.transform || window.getComputedStyle(el).transform || '';
  const m3d  = st.match(/translate3d\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);
  if (m3d) return { x: parseFloat(m3d[1]), y: parseFloat(m3d[2]) };
  const m2d  = st.match(/translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);
  if (m2d) return { x: parseFloat(m2d[1]), y: parseFloat(m2d[2]) };
  const mat  = st.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/);
  if (mat) return { x: parseFloat(mat[1]), y: parseFloat(mat[2]) };
  return { x: 0, y: 0 };
}

function _niceScale(m) {
  const nice = [100, 250, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000, 200000, 500000];
  for (const n of nice) if (n >= m * 0.5) return n;
  return nice[nice.length - 1];
}

function _fmtDistance(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(0)} km` : `${m} m`;
}

function _fmtHa(ha) {
  if (!ha && ha !== 0) return '—';
  if (ha >= 1_000_000) return `${(ha / 1_000_000).toFixed(2)}M`;
  if (ha >= 1_000)     return `${(ha / 1_000).toFixed(1)}k`;
  return ha.toFixed(0);
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

/**
 * Generates a professional map PNG and triggers a download.
 *
 * @param {object} leafletMap - Leaflet map instance
 * @param {HTMLElement} mapEl  - Map container DOM element
 * @param {object} opts
 *   @param {string}   opts.title       - Map title
 *   @param {string}   [opts.subtitle]  - Subtitle / target description
 *   @param {Array}    [opts.layers]    - [{ label, color, symbol, area_ha }]
 *   @param {string}   [opts.source]    - Data source line
 *   @param {string}   [opts.date]      - Date string
 *   @param {string}   [opts.disclaimer]
 */
export async function exportMapTemplate(leafletMap, mapEl, opts = {}) {
  // Record the display map width for scale bar calculations
  mapEl_W = mapEl.offsetWidth || 800;

  const {
    title      = 'Vanuatu NBSAP GIS Data Map',
    subtitle   = '',
    layers     = [],
    source     = 'Department of Environmental Protection & Conservation (DEPC), Vanuatu Government. Spatial data compiled from field surveys, remote sensing, and partner organisations.',
    date       = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    disclaimer = 'This map is produced for planning, monitoring, and reporting purposes only. Boundaries and features are indicative and do not constitute legal definitions. For authoritative boundaries consult DEPC and relevant government agencies.',
  } = opts;

  // ── Load logos in parallel ────────────────────────────────────────────────
  const base = _base();
  const [coaImg, depcImg, cbdImg, vssImg] = await Promise.all([
    _loadImg(`${base}logos/vanuatu-coat-of-arms.svg`),
    _loadImg(`${base}logos/depc-logo.png`),
    _loadImg(`${base}logos/cbd-logo.png`),
    _loadImg(`${base}logos/vss-logo.jpeg`),
  ]);

  // ── Create canvas ─────────────────────────────────────────────────────────
  const canvas  = document.createElement('canvas');
  canvas.width  = W * DPR;
  canvas.height = H * DPR;
  const ctx     = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  // Overall white base
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  // ── Draw sections ─────────────────────────────────────────────────────────
  _drawHeader(ctx, coaImg, depcImg, cbdImg, title, subtitle);
  await _drawMapArea(ctx, leafletMap, mapEl);
  _drawSidebar(ctx, leafletMap, layers);
  _drawFooter(ctx, vssImg, source, date, disclaimer);

  // ── Outer page border ─────────────────────────────────────────────────────
  ctx.strokeStyle = C.borderDark;
  ctx.lineWidth   = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  // ── Download ──────────────────────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('toBlob null')); return; }
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href    = url;
        a.download = `nbsap-map-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        resolve();
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}
