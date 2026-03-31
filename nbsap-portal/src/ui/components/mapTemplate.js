/**
 * Professional Map Export Template — Portrait layout matching the print-map UI.
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │ FLAG  Vanuatu NBSAP GIS Portal          DATE / CRS  │
 *  ├─────────────────────────────────────────────────────┤
 *  │ [T4]  Target Title · Description                    │
 *  ├──────┬──────┬──────┬──────┬──────┬──────────────────┤
 *  │ KPI1 │ KPI2 │ KPI3 │ KPI4 │ KPI5 │ KPI6             │
 *  ├─────────────────────────────────────────────────────┤
 *  │              MAP AREA         │ LEGEND              │
 *  │ [scale]                 [N↑]  │                     │
 *  ├─────────────────────────────────────────────────────┤
 *  │ Total area: X ha | Y records across Z datasets      │
 *  ├──────────────────────────┬──────────────────────────┤
 *  │ PROVINCIAL BREAKDOWN     │ CATEGORY BREAKDOWN        │
 *  ├─────────────────────────────────────────────────────┤
 *  │ Source …      © 2026 Republic of Vanuatu  VSS       │
 *  └─────────────────────────────────────────────────────┘
 */

// ── Vanuatu flag SVG ──────────────────────────────────────────────────────────
const FLAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 640 480"><defs><clipPath id="a"><path d="M0 0v475l420-195h480v-85H420Z"/></clipPath></defs><path fill="#009543" d="M0 0h640v480H0z"/><path fill="#d21034" d="M0 0h640v240H0z"/><g clip-path="url(#a)" transform="scale(.71111 1.01053)"><path stroke="#fdce12" stroke-width="110" d="m0 0 420 195h480v85H420L0 475"/><path fill="none" stroke="#000" stroke-width="60" d="m0 0 420 195h480m0 85H420L0 475"/></g><g fill="#fdce12" transform="translate(-22)scale(1.01053)"><path d="M106.9 283v27c23.5 0 69.7-18 69.7-76.1s-49.3-68.9-64-68.9-60.3 10.6-60.3 58c0 47.6 44.7 52 53.5 52s41.8-8 38-43.6a35.5 35.5 0 0 1-35.4 31.5c-24 0-39-17.8-39-35.4s14.6-41.2 39.9-41.2 43.8 22.5 43.8 45.1-17.8 51.5-46.2 51.5z"/></g></svg>`;

// ── Layout constants ──────────────────────────────────────────────────────────
const W       = 1190;
const DPR     = 2;
const PAD     = 20;
const HDR_H   = 78;
const TGT_H   = 88;
const STT_H   = 66;
const MAP_H   = 455;
const SUM_H   = 30;
const FTR_H   = 46;
const ROW_H   = 19;
const THDR_H  = 26;   // table section header + col header combined

// Derived Y positions
const TGT_Y  = HDR_H;
const STT_Y  = TGT_Y + TGT_H;
const MAP_Y  = STT_Y + STT_H;
const SUM_Y  = MAP_Y + MAP_H;
const TBL_Y  = SUM_Y + SUM_H;

// Colours
const C = {
  green:    '#006B3F',
  greenDk:  '#004D2C',
  blue:     '#0072BC',
  amber:    '#E5A100',
  text:     '#1A202C',
  textSec:  '#616E7C',
  textTer:  '#9AA5B4',
  border:   '#E4E7EB',
  borderMd: '#CBD2D9',
  bg:       '#F1F3F5',
  bgAlt:    '#F8FAFB',
  white:    '#FFFFFF',
};

let _mapElW = 800; // updated at export time

// ── Image helpers ─────────────────────────────────────────────────────────────
function _img(src) {
  return new Promise(res => {
    const i = new Image(); i.crossOrigin = 'anonymous';
    i.onload = () => res(i); i.onerror = () => res(null); i.src = src;
  });
}
function _svgImg(svgStr) {
  const url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml' }));
  return _img(url).then(i => { URL.revokeObjectURL(url); return i; });
}
function _base() { const p = window.location.pathname; return p.slice(0, p.lastIndexOf('/') + 1); }

// ── Drawing helpers ───────────────────────────────────────────────────────────
function _t(ctx, str, x, y, { sz = 12, w = 'normal', c = C.text, a = 'left', mw } = {}) {
  ctx.font = `${w} ${sz}px 'Segoe UI',Arial,sans-serif`;
  ctx.fillStyle = c; ctx.textAlign = a; ctx.textBaseline = 'top';
  mw ? ctx.fillText(String(str), x, y, mw) : ctx.fillText(String(str), x, y);
}
function _wrap(ctx, str, x, y, maxW, lh, { sz = 11, c = C.textSec } = {}) {
  ctx.font = `normal ${sz}px 'Segoe UI',Arial,sans-serif`;
  ctx.fillStyle = c; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  let line = '', curY = y;
  for (const word of String(str).split(' ')) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, curY, maxW); line = word; curY += lh;
    } else { line = test; }
  }
  if (line) ctx.fillText(line, x, curY, maxW);
  return curY + lh;
}
function _rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+r,r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.arcTo(x,y+h,x,y+h-r,r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}
function _parse(el) {
  if (!el) return {x:0,y:0};
  const st = el.style?.transform || window.getComputedStyle(el).transform || '';
  const m3 = st.match(/translate3d\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);
  if (m3) return {x:+m3[1],y:+m3[2]};
  const m2 = st.match(/translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);
  if (m2) return {x:+m2[1],y:+m2[2]};
  const mm = st.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/);
  if (mm) return {x:+mm[1],y:+mm[2]};
  return {x:0,y:0};
}

// ── HEADER ────────────────────────────────────────────────────────────────────
function _header(ctx, flagImg, date) {
  ctx.fillStyle = C.white; ctx.fillRect(0, 0, W, HDR_H);

  const fH = 48, fW = flagImg ? Math.round(fH * flagImg.naturalWidth / flagImg.naturalHeight) : 72;
  const fY = (HDR_H - 3 - fH) / 2;
  if (flagImg) ctx.drawImage(flagImg, PAD, fY, fW, fH);

  const tx = PAD + fW + 14;
  _t(ctx, 'Vanuatu NBSAP GIS Portal', tx, 14, { sz:20, w:'700', c:C.green });
  _t(ctx, 'National Biodiversity Strategies and Action Plan', tx, 40, { sz:11, c:C.textSec });
  _t(ctx, date, W - PAD, 14, { sz:13, w:'700', a:'right' });
  _t(ctx, 'CRS: EPSG:4326 (WGS 84)', W - PAD, 34, { sz:10, c:C.textSec, a:'right' });

  // Border
  ctx.fillStyle = C.greenDk; ctx.fillRect(0, HDR_H - 3, W, 2);
  ctx.fillStyle = C.amber;   ctx.fillRect(0, HDR_H - 1, W, 1);
}

// ── TARGET BAR ────────────────────────────────────────────────────────────────
function _targetBar(ctx, code, title, desc) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, TGT_Y, W, TGT_H);

  const bs = 34, bx = PAD, by = TGT_Y + (TGT_H - bs) / 2;
  _rr(ctx, bx, by, bs, bs, 6);
  ctx.fillStyle = C.greenDk; ctx.fill();
  _t(ctx, code, bx + bs/2, by + 8, { sz:12, w:'800', c:'#fff', a:'center' });

  const tx = PAD + bs + 12, tw = W - tx - PAD;
  _t(ctx, title, tx, TGT_Y + 12, { sz:15, w:'700', mw:tw });
  _wrap(ctx, desc || '', tx, TGT_Y + 35, tw, 14, { sz:10.5 });

  ctx.fillStyle = C.border; ctx.fillRect(0, TGT_Y + TGT_H - 1, W, 1);
}

// ── STATS BAR ─────────────────────────────────────────────────────────────────
function _statsBar(ctx, stats) {
  ctx.fillStyle = C.white; ctx.fillRect(0, STT_Y, W, STT_H);
  ctx.fillStyle = C.border; ctx.fillRect(0, STT_Y, W, 1); ctx.fillRect(0, STT_Y + STT_H - 1, W, 1);
  const cw = W / stats.length;
  stats.forEach(({ value, label, color = C.text, sublabel }, i) => {
    const x = i * cw;
    if (i > 0) { ctx.fillStyle = C.border; ctx.fillRect(x, STT_Y + 8, 1, STT_H - 16); }
    _t(ctx, value ?? '—', x + cw/2, STT_Y + 8, { sz:20, w:'800', c:color, a:'center' });
    if (sublabel) _t(ctx, sublabel, x + cw/2, STT_Y + 31, { sz:8, c:C.textTer, a:'center' });
    _t(ctx, label, x + cw/2, sublabel ? STT_Y + 44 : STT_Y + 33, { sz:8.5, w:'600', c:C.textSec, a:'center' });
  });
}

// ── MAP AREA ──────────────────────────────────────────────────────────────────
async function _mapArea(ctx, leafletMap, mapEl, legendItems) {
  ctx.save();
  ctx.beginPath(); ctx.rect(0, MAP_Y, W, MAP_H); ctx.clip();
  ctx.fillStyle = '#e8f4fa'; ctx.fillRect(0, MAP_Y, W, MAP_H);

  const pane = mapEl.querySelector('.leaflet-map-pane');
  const pt   = _parse(pane);
  const dw   = mapEl.offsetWidth || 1, dh = mapEl.offsetHeight || 1;
  const sc   = Math.min(W / dw, MAP_H / dh);
  const ox   = (W - dw * sc) / 2;
  const oy   = MAP_Y + (MAP_H - dh * sc) / 2;

  ctx.translate(ox, oy); ctx.scale(sc, sc);

  // Tiles
  const tilePane = mapEl.querySelector('.leaflet-tile-pane');
  if (tilePane) {
    const jobs = [];
    for (const c of tilePane.querySelectorAll('.leaflet-tile-container')) {
      const ct = _parse(c);
      for (const tile of c.querySelectorAll('img.leaflet-tile')) {
        if (!tile.src || !tile.naturalWidth) continue;
        const tt = _parse(tile);
        const tx = pt.x+ct.x+tt.x, ty = pt.y+ct.y+tt.y;
        const tw = tile.width||256, th = tile.height||256;
        jobs.push(_img(tile.src).then(img => img ? {img,tx,ty,tw,th} : null));
      }
    }
    for (const t of await Promise.all(jobs)) {
      if (t) try { ctx.drawImage(t.img, t.tx, t.ty, t.tw, t.th); } catch (_) {}
    }
  }

  // Vector canvas overlays
  const op = mapEl.querySelector('.leaflet-overlay-pane');
  for (const cvs of mapEl.querySelectorAll('.leaflet-overlay-pane canvas')) {
    if (!cvs.width || !cvs.height) continue;
    try {
      const opt = _parse(op), ct = _parse(cvs);
      ctx.drawImage(cvs, pt.x+opt.x+ct.x, pt.y+opt.y+ct.y);
    } catch (_) {}
  }

  // SVG overlays
  const mr = mapEl.getBoundingClientRect();
  for (const svg of mapEl.querySelectorAll('.leaflet-overlay-pane svg')) {
    try {
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], {type:'image/svg+xml'}));
      const img = await _img(url); URL.revokeObjectURL(url);
      const r = svg.getBoundingClientRect();
      if (img) ctx.drawImage(img, r.left-mr.left, r.top-mr.top, r.width, r.height);
    } catch (_) {}
  }
  ctx.restore();

  // Map border
  ctx.strokeStyle = C.borderMd; ctx.lineWidth = 1;
  ctx.strokeRect(0.5, MAP_Y+0.5, W-1, MAP_H-1);

  // ── Legend overlay ──────────────────────────────────────────────────────────
  if (legendItems?.length > 0) {
    const lp = 9, lr = 16, lw = 185;
    const lh = lp*2 + 14 + legendItems.length * lr;
    const lx = W - lw - 12, ly = MAP_Y + 12;
    _rr(ctx, lx, ly, lw, lh, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.96)'; ctx.fill();
    ctx.strokeStyle = C.borderMd; ctx.lineWidth = 0.75;
    _rr(ctx, lx, ly, lw, lh, 4); ctx.stroke();
    _t(ctx, 'LEGEND', lx+lp, ly+lp, { sz:8.5, w:'700', c:C.greenDk });
    legendItems.forEach(({ label, color, symbol }, i) => {
      const iy = ly + lp + 14 + i * lr, ix = lx + lp;
      if (symbol === 'province') {
        ctx.setLineDash([2,2]); ctx.strokeStyle = C.textSec; ctx.lineWidth = 1;
        ctx.strokeRect(ix, iy+2, 12, 9); ctx.setLineDash([]);
      } else if (symbol === 'point') {
        ctx.beginPath(); ctx.arc(ix+6, iy+6, 5, 0, Math.PI*2);
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 0.5; ctx.stroke();
      } else {
        ctx.fillStyle = color+'AA'; ctx.strokeStyle = color; ctx.lineWidth = 1;
        ctx.fillRect(ix, iy+2, 12, 9); ctx.strokeRect(ix, iy+2, 12, 9);
      }
      _t(ctx, label, ix+17, iy+2, { sz:9.5, mw: lw-26 });
    });
  }

  // ── North arrow ─────────────────────────────────────────────────────────────
  const nb = 44, nx = W-nb-12, ny = MAP_Y+MAP_H-nb-12;
  _rr(ctx, nx, ny, nb, nb, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill();
  ctx.strokeStyle = C.borderMd; ctx.lineWidth = 0.75;
  _rr(ctx, nx, ny, nb, nb, 4); ctx.stroke();
  const cx = nx+nb/2, cy = ny+nb/2+3, R = 12;
  ctx.beginPath(); ctx.moveTo(cx,cy-R); ctx.lineTo(cx+5,cy+2); ctx.lineTo(cx,cy); ctx.closePath();
  ctx.fillStyle = '#2D3748'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx,cy+R); ctx.lineTo(cx-5,cy+2); ctx.lineTo(cx,cy); ctx.closePath();
  ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#2D3748'; ctx.lineWidth=0.5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx,cy+R); ctx.lineTo(cx+5,cy+2); ctx.lineTo(cx,cy); ctx.closePath();
  ctx.fillStyle = '#2D3748'; ctx.fill();
  _t(ctx, 'N', cx, ny+4, { sz:11, w:'800', c:'#2D3748', a:'center' });

  // ── Scale bar ────────────────────────────────────────────────────────────────
  const zoom = leafletMap.getZoom(), ctr = leafletMap.getCenter();
  const mpp  = 156543.03392 * Math.cos(ctr.lat * Math.PI/180) / Math.pow(2, zoom);
  const tgtM = mpp * 180 * (_mapElW / W);
  const nice = [50,100,200,500,1000,2000,5000,10000,25000,50000,100000,200000,500000].find(n => n >= tgtM*0.5) || 500000;
  const barW = Math.min(Math.round(nice / mpp * (W / _mapElW)), 180);
  const sx = 14, sy = MAP_Y + MAP_H - 26;
  ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fillRect(sx-3, sy-2, barW+8, 22);
  for (let i=0; i<2; i++) {
    const sw = barW/2;
    ctx.fillStyle = i%2===0 ? '#2D3748' : '#fff';
    ctx.strokeStyle = '#2D3748'; ctx.lineWidth = 0.75;
    ctx.fillRect(sx+i*sw, sy+4, sw, 7); ctx.strokeRect(sx+i*sw, sy+4, sw, 7);
  }
  ctx.strokeStyle='#2D3748'; ctx.lineWidth=1;
  [[sx,sy+2,sx,sy+12],[sx+barW,sy+2,sx+barW,sy+12]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });
  _t(ctx,'0',sx,sy+13,{sz:8,c:'#2D3748'});
  const lbl = nice>=1000?`${(nice/1000).toFixed(0)} km`:`${nice} m`;
  _t(ctx,lbl,sx+barW,sy+13,{sz:8,c:'#2D3748',a:'right'});
}

// ── SUMMARY LINE ──────────────────────────────────────────────────────────────
function _summary(ctx, text) {
  ctx.fillStyle = C.white; ctx.fillRect(0, SUM_Y, W, SUM_H);
  ctx.fillStyle = C.border; ctx.fillRect(0, SUM_Y, W, 1);
  _t(ctx, text, PAD, SUM_Y + 9, { sz:10.5, c:C.textSec });
}

// ── TABLES ────────────────────────────────────────────────────────────────────
function _tables(ctx, provRows, catRows, tblH) {
  ctx.fillStyle = C.white; ctx.fillRect(0, TBL_Y, W, tblH);
  ctx.fillStyle = C.border;
  ctx.fillRect(0, TBL_Y, W, 1);
  ctx.fillRect(W/2, TBL_Y, 1, tblH);     // vertical divider

  const hw = W/2 - 1;
  _provTable(ctx, provRows, PAD, TBL_Y + 12, hw - PAD*2);
  _catTable (ctx, catRows,  W/2 + PAD, TBL_Y + 12, hw - PAD*2);
}

function _provTable(ctx, rows, x, y, w) {
  _t(ctx, 'PROVINCIAL BREAKDOWN', x, y, { sz:10, w:'700' });
  y += 18;
  const cols = [
    {lbl:'Province',       key:'province',       fw:0.30, a:'left' },
    {lbl:'Terrestrial(ha)',key:'terrestrial_ha', fw:0.25, a:'right'},
    {lbl:'Marine(ha)',     key:'marine_ha',      fw:0.20, a:'right'},
    {lbl:'Total(ha)',      key:'total_ha',       fw:0.18, a:'right'},
    {lbl:'Rec.',           key:'features',       fw:0.07, a:'right'},
  ];
  // Col headers
  ctx.fillStyle = C.bg; ctx.fillRect(x, y, w, 18);
  let cx = x;
  for (const col of cols) {
    const cw = Math.round(w*col.fw);
    _t(ctx, col.lbl, col.a==='right' ? cx+cw-2 : cx+2, y+4, { sz:8, w:'700', c:C.textSec, a:col.a });
    cx += cw;
  }
  y += 18;
  rows.slice(0,25).forEach((row, i) => {
    if (i%2===0) { ctx.fillStyle=C.bgAlt; ctx.fillRect(x,y,w,ROW_H); }
    let cx2 = x;
    for (const col of cols) {
      const cw = Math.round(w*col.fw);
      let v = row[col.key];
      if (col.a==='right' && col.key!=='features') v = typeof v==='number' ? v.toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2}) : (v??'0.00');
      _t(ctx, String(v??''), col.a==='right'?cx2+cw-2:cx2+2, y+4, { sz:8.5, a:col.a });
      cx2 += cw;
    }
    y += ROW_H;
  });
  ctx.fillStyle=C.border; ctx.fillRect(x,y,w,1);
}

function _catTable(ctx, rows, x, y, w) {
  _t(ctx, 'CATEGORY BREAKDOWN', x, y, { sz:10, w:'700' });
  y += 18;
  const cols = [
    {lbl:'Category', key:'label',    fw:0.52, a:'left' },
    {lbl:'Area(ha)', key:'area_ha',  fw:0.34, a:'right'},
    {lbl:'Rec.',     key:'features', fw:0.14, a:'right'},
  ];
  ctx.fillStyle = C.bg; ctx.fillRect(x, y, w, 18);
  let cx = x;
  for (const col of cols) {
    const cw = Math.round(w*col.fw);
    _t(ctx, col.lbl, col.a==='right'?cx+cw-2:cx+22, y+4, { sz:8, w:'700', c:C.textSec, a:col.a });
    cx += cw;
  }
  y += 18;
  rows.slice(0,25).forEach((row, i) => {
    if (i%2===0) { ctx.fillStyle=C.bgAlt; ctx.fillRect(x,y,w,ROW_H); }
    ctx.beginPath(); ctx.arc(x+7, y+ROW_H/2, 4.5, 0, Math.PI*2);
    ctx.fillStyle = row.color||C.green; ctx.fill();
    let cx2 = x;
    for (const col of cols) {
      const cw = Math.round(w*col.fw);
      let v = row[col.key];
      if (col.key==='area_ha') v = typeof v==='number' ? v.toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2}) : (v??'0.00');
      const tx = col.key==='label' ? cx2+16 : (col.a==='right'?cx2+cw-2:cx2+2);
      _t(ctx, String(v??''), tx, y+4, { sz:8.5, a:col.a, mw:col.key==='label'?cw-18:undefined });
      cx2 += cw;
    }
    y += ROW_H;
  });
  ctx.fillStyle=C.border; ctx.fillRect(x,y,w,1);
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function _footer(ctx, vssImg, source, fy) {
  ctx.fillStyle = C.bgAlt; ctx.fillRect(0, fy, W, FTR_H);
  ctx.fillStyle = C.green; ctx.fillRect(0, fy, W, 2);
  _t(ctx, 'Source: ' + (source||''), PAD, fy+8, { sz:9, c:C.textSec });
  _t(ctx, `© ${new Date().getFullYear()} Republic of Vanuatu — Department of Environmental Protection & Conservation`, PAD, fy+22, { sz:8.5, c:C.textTer });
  if (vssImg) {
    const lh=16, lw=Math.round(lh*vssImg.naturalWidth/vssImg.naturalHeight);
    ctx.globalAlpha=0.35; ctx.drawImage(vssImg, W-PAD-lw, fy+10, lw, lh); ctx.globalAlpha=1;
  }
  ctx.font='italic 9px Segoe UI,Arial,sans-serif'; ctx.fillStyle='rgba(100,116,139,0.45)';
  ctx.textAlign='right'; ctx.textBaseline='top';
  ctx.fillText('developed by  VANUA SPATIAL SOLUTIONS', W-PAD-(vssImg?Math.round(16*vssImg.naturalWidth/vssImg.naturalHeight)+6:0), fy+8);
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────
/**
 * Generates a professional portrait map PNG and triggers download.
 *
 * @param {object}  leafletMap
 * @param {Element} mapEl
 * @param {object}  opts
 *   title, subtitle, targetCode, stats, legendItems,
 *   summary, provinceRows, categoryRows, source, date
 */
export async function exportMapTemplate(leafletMap, mapEl, opts = {}) {
  _mapElW = mapEl.offsetWidth || 800;
  const {
    title        = 'Vanuatu NBSAP Conservation Areas',
    subtitle     = '',
    targetCode   = '',
    stats        = [],
    legendItems  = [],
    summary      = '',
    provinceRows = [],
    categoryRows = [],
    source       = 'Department of Environmental Protection & Conservation (DEPC), Vanuatu Government. Spatial data from field surveys, remote sensing and partner organisations.',
    date         = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }),
  } = opts;

  // Dynamic height based on table rows
  const maxRows = Math.max(provinceRows.length, categoryRows.length, 2);
  const tblH    = THDR_H + 18 + maxRows * ROW_H + 16;
  const H       = HDR_H + TGT_H + STT_H + MAP_H + SUM_H + tblH + FTR_H;
  const footY   = TBL_Y + tblH;

  const [flagImg, vssImg] = await Promise.all([
    _svgImg(FLAG_SVG),
    _img(`${_base()}logos/vss-logo.jpeg`),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = W*DPR; canvas.height = H*DPR;
  const ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  _header  (ctx, flagImg, date);
  _targetBar(ctx, targetCode, title, subtitle);
  if (stats.length) _statsBar(ctx, stats);
  await _mapArea(ctx, leafletMap, mapEl, legendItems);
  _summary (ctx, summary);
  _tables  (ctx, provinceRows, categoryRows, tblH);
  _footer  (ctx, vssImg, source, footY);

  // Outer border
  ctx.strokeStyle = C.borderMd; ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, W-1, H-1);

  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('toBlob null')); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `nbsap-map-${new Date().toISOString().slice(0,10)}.png`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        resolve();
      }, 'image/png');
    } catch (err) { reject(err); }
  });
}
