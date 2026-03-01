/**
 * SVG Icons for the Vanuatu NBSAP Portal.
 *
 * All icons sourced from Lucide (https://lucide.dev) — ISC License.
 * @license lucide-static v0.575.0 - ISC
 *
 * Each icon is a function returning an inline SVG string at a given size.
 * Default size 16px; stroke inherits currentColor for easy theming.
 *
 * Colorful target icons are hand-crafted, thematic SVGs with fills + strokes.
 */

const S = 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

function svg(size, inner) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${S}>${inner}</svg>`;
}

// ── Colorful Target Icons ────────────────────────────────────────────
// Each icon uses explicit fills + strokes matching the target's theme color.

const COLORFUL_TARGET_ICONS = {
  // T1 – Biodiversity Spatial Planning (blue #1565C0)
  // A stylised map with location pin and grid lines
  T1: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <polygon points="2,5 9,3 15,5.5 22,3 22,19 15,21 9,19 2,21" fill="#BBDEFB"/>
    <polygon points="2,5 9,3 15,5.5 22,3 22,19 15,21 9,19 2,21" fill="none" stroke="#1565C0" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="9" y1="3" x2="9" y2="19" stroke="#1565C0" stroke-width="1.3"/>
    <line x1="15" y1="5.5" x2="15" y2="21" stroke="#1565C0" stroke-width="1.3"/>
    <path d="M12 7 C10.3 7 9 8.3 9 10 C9 12.5 12 16 12 16 C12 16 15 12.5 15 10 C15 8.3 13.7 7 12 7Z" fill="#1565C0"/>
    <circle cx="12" cy="10" r="1.5" fill="white"/>
  </svg>`,

  // T2 – Degraded Area Mapping & Restoration (orange #D84315)
  // A seedling sprouting from cracked earth
  T2: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="17" width="20" height="5" rx="1.5" fill="#BCAAA4"/>
    <path d="M8 17 C7 14 6 11 8 8" stroke="#8D6E63" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M16 17 C17 14 18 11 16 8" stroke="#8D6E63" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M12 17 V9" stroke="#5D4037" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 14 C10 12 7 12 6 10 C7 8 10 8 12 10" fill="#66BB6A" stroke="#388E3C" stroke-width="1"/>
    <path d="M12 11 C14 9 17 9 18 7 C17 5 14 5 12 7" fill="#81C784" stroke="#388E3C" stroke-width="1"/>
    <circle cx="8" cy="17.5" r="0.8" fill="#FF8A65"/>
    <circle cx="14" cy="17.5" r="0.8" fill="#FF8A65"/>
  </svg>`,

  // T3 – 30×30 Conservation (green #2E7D32)
  // A protective shield with a leaf + "30" concept
  T3: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L20 5.5 V12 C20 17 16.4 21.4 12 22.8 C7.6 21.4 4 17 4 12 V5.5 Z" fill="#C8E6C9" stroke="#2E7D32" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="12" cy="13" r="5" fill="#2E7D32"/>
    <path d="M12 9 C10 9 8 11 9 13 C10 15 12 14 12 14 C12 14 14 15 15 13 C16 11 14 9 12 9Z" fill="#A5D6A7"/>
    <path d="M12 14 V17" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M10 12 L12 14 L15 10.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // T4 – Species & Biodiversity Distribution (purple #7E57C2)
  // A colourful bird in flight
  T4: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 7 C20 7 16 5 12 7 C9 8.5 7 11 7 14 C7 14 9.5 11.5 12 12 C14.5 12.5 16.5 15 16 17 L18.5 14.5 C21 12 22.5 9.5 20 7Z" fill="#9575CD" stroke="#5E35B1" stroke-width="1"/>
    <path d="M7 14 C5 15.5 3 16 1.5 15.5 C3 17.5 7 17.5 9.5 16.5 C9.5 16.5 8.5 15.5 7 14Z" fill="#7E57C2"/>
    <circle cx="15" cy="6.5" r="1.3" fill="#CE93D8"/>
    <ellipse cx="14.5" cy="6.8" rx="0.5" ry="0.4" fill="#1A237E"/>
    <path d="M9.5 12.5 L8 20" stroke="#7E57C2" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M11.5 12.5 L10.5 20" stroke="#9575CD" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M17 6 C18 5 19 4 20 5" stroke="#CE93D8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </svg>`,

  // T6 – Invasive Alien Species (red #C62828)
  // A stylised insect / bug
  T6: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="13" rx="5" ry="6.5" fill="#FFCDD2" stroke="#C62828" stroke-width="1.5"/>
    <line x1="7" y1="9"  x2="3"  y2="7"  stroke="#C62828" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="7" y1="13" x2="2"  y2="13" stroke="#C62828" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="7" y1="17" x2="3"  y2="19" stroke="#C62828" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="17" y1="9"  x2="21" y2="7"  stroke="#C62828" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="17" y1="13" x2="22" y2="13" stroke="#C62828" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="17" y1="17" x2="21" y2="19" stroke="#C62828" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="12" cy="6.5" rx="3.5" ry="3" fill="#EF9A9A" stroke="#C62828" stroke-width="1.5"/>
    <circle cx="10.5" cy="5.8" r="0.9" fill="#B71C1C"/>
    <circle cx="13.5" cy="5.8" r="0.9" fill="#B71C1C"/>
    <line x1="12" y1="10" x2="12" y2="19.5" stroke="#C62828" stroke-width="1" stroke-dasharray="2,1.5"/>
  </svg>`,

  // T7 – Pesticide & Herbicide Mapping (purple #8E24AA)
  // A laboratory flask with droplets
  T7: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 2 H15 V6.5 L19.5 14.5 C21 17 20 20 18 21 C16.5 22 13.5 22.5 12 22.5 C10.5 22.5 7.5 22 6 21 C4 20 3 17 4.5 14.5 Z" fill="#F3E5F5" stroke="#8E24AA" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="9" y1="6.5" x2="15" y2="6.5" stroke="#8E24AA" stroke-width="1.5"/>
    <ellipse cx="9.5" cy="16.5" rx="2" ry="2" fill="#CE93D8" opacity="0.8"/>
    <ellipse cx="14" cy="19"   rx="1.5" ry="1.5" fill="#AB47BC" opacity="0.8"/>
    <ellipse cx="15.5" cy="15" rx="1.2" ry="1.2" fill="#8E24AA" opacity="0.7"/>
    <path d="M12 3.5 V6.5" stroke="#8E24AA" stroke-width="1.5"/>
    <path d="M10 2 H14" stroke="#6A1B9A" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // T8 – Coastal Eutrophication (teal #00838F)
  // Ocean waves with a rising sun / nutrient haze
  T8: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="14" width="20" height="8" rx="2" fill="#B2EBF2"/>
    <path d="M2 14 C4.5 12 6.5 13.2 9 14 C11.5 14.8 13.5 12.5 16 14 C18 15 20 13 22 14" stroke="#00838F" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M2 18 C4.5 16.5 6.5 17.5 9 18 C11.5 18.5 13.5 16.5 16 18 C18 19 20 17 22 18" stroke="#0097A7" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.7"/>
    <circle cx="12" cy="6.5" r="4" fill="#FFF9C4" stroke="#F9A825" stroke-width="1.2"/>
    <line x1="12" y1="1"    x2="12" y2="2.5"  stroke="#F9A825" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="16.5" y1="2.5" x2="15.5" y2="3.5" stroke="#F9A825" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="7.5"  y1="2.5" x2="8.5"  y2="3.5" stroke="#F9A825" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M9 10 C10 8.5 14 8.5 15 10" stroke="#4CAF50" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.8"/>
  </svg>`,

  // T10 – Agriculture & Land Cover Change (brown #795548)
  // Wheat stalks over a field
  T10: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="19" width="20" height="4" rx="1" fill="#8D6E63"/>
    <path d="M7 19 L9 8" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="9"  cy="7"   rx="2.5" ry="1.8" fill="#FDD835" transform="rotate(-10,9,7)"/>
    <ellipse cx="8"  cy="10"  rx="1.8" ry="1.3" fill="#FBC02D" transform="rotate(-20,8,10)"/>
    <ellipse cx="10" cy="10"  rx="1.8" ry="1.3" fill="#FBC02D" transform="rotate(15,10,10)"/>
    <path d="M14 19 L16 8" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="16" cy="7"   rx="2.5" ry="1.8" fill="#FDD835" transform="rotate(10,16,7)"/>
    <ellipse cx="15" cy="10"  rx="1.8" ry="1.3" fill="#FBC02D" transform="rotate(-15,15,10)"/>
    <ellipse cx="17" cy="10"  rx="1.8" ry="1.3" fill="#FBC02D" transform="rotate(20,17,10)"/>
    <path d="M3 19 Q6 16 9 19 Q12 22 15 19 Q18 16 22 19" stroke="#A5D6A7" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.8"/>
  </svg>`,

  // T12 – Blue & Green Spaces (green #388E3C)
  // Two trees with a water element
  T12: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="19" width="20" height="3" rx="1" fill="#A5D6A7"/>
    <rect x="10" y="16" width="4" height="3" rx="0.5" fill="#81D4FA"/>
    <line x1="8"  y1="19" x2="8"  y2="15" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/>
    <polygon points="8,15 4,9  12,9"  fill="#43A047"/>
    <polygon points="8,12 5,7  11,7"  fill="#66BB6A"/>
    <polygon points="8,9  6,5  10,5" fill="#81C784"/>
    <line x1="16" y1="19" x2="16" y2="15" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/>
    <polygon points="16,15 12,9  20,9"  fill="#388E3C"/>
    <polygon points="16,12 13,7  19,7"  fill="#4CAF50"/>
    <polygon points="16,9  14,5  18,5" fill="#66BB6A"/>
    <path d="M10 17 Q12 15 14 17" stroke="#29B6F6" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  </svg>`
};

/**
 * Returns a colorful thematic SVG icon for a given NBSAP target code.
 * @param {string} targetCode  e.g. 'T1', 'T3'
 * @param {number} [size=20]
 * @returns {string} SVG markup string
 */
export function colorfulTargetIcon(targetCode, size = 20) {
  const fn = COLORFUL_TARGET_ICONS[targetCode];
  return fn ? fn(size) : targetIcon(targetCode, size);
}

// ── Icon path definitions ────────────────────────────────────────────

const PATHS = {
  anchor:       '<path d="M12 6v16"/><path d="m19 13 2-1a9 9 0 0 1-18 0l2 1"/><path d="M9 11h6"/><circle cx="12" cy="4" r="2"/>',
  landmark:     '<path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',
  users:        '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  waves:        '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  shield:       '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  shieldCheck:  '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  star:         '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  fish:         '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"/>',
  map:          '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  triangleAlert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  sprout:       '<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>',
  search:       '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/>',
  bird:         '<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>',
  leaf:         '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  ban:          '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  wind:         '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
  flaskConical: '<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',
  droplets:     '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  layers:       '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  trees:        '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
  globe:        '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  bug:          '<path d="M12 20v-9"/><path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z"/><path d="M14.12 3.88 16 2"/><path d="M21 21a4 4 0 0 0-3.81-4"/><path d="M21 5a4 4 0 0 1-3.55 3.97"/><path d="M22 13h-4"/><path d="M3 21a4 4 0 0 1 3.81-4"/><path d="M3 5a4 4 0 0 0 3.55 3.97"/><path d="M6 13H2"/><path d="m8 2 1.88 1.88"/><path d="M9 7.13V6a3 3 0 1 1 6 0v1.13"/>',
  wheat:        '<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/>',
  circle:       '<circle cx="12" cy="12" r="10"/>'
};

// ── Helper to add bat-like icon (not in Lucide, simple custom design) ──
// Stylistically consistent with Lucide: 24x24, stroke-based
PATHS.bat = '<path d="M12 4c-1 2-4 4-8 5 1 3 3 5 5 6l-2 3h10l-2-3c2-1 4-3 5-6-4-1-7-3-8-5z"/><circle cx="10" cy="9" r="1"/><circle cx="14" cy="9" r="1"/>';

// ── Exported icon generators ─────────────────────────────────────────

/**
 * Returns an inline SVG icon string at the specified size.
 * @param {string} name  - Icon name (key from PATHS)
 * @param {number} [size=16] - Pixel size (square)
 * @returns {string} SVG markup string, or '' if name not found
 */
export function icon(name, size = 16) {
  const path = PATHS[name];
  return path ? svg(size, path) : '';
}

// ── Category → icon name mapping ─────────────────────────────────────

export const CATEGORY_ICONS = {
  EEZ:             'anchor',
  ADMIN_BOUNDARY:  'landmark',
  CCA:             'users',
  MPA:             'waves',
  PA:              'shield',
  OECM:            'shieldCheck',
  KBA:             'star',
  LMMA:            'fish',
  SPATIAL_PLAN:    'map',
  DEGRADED:        'triangleAlert',
  RESTORATION:     'sprout',
  SPECIES_DIST:    'search',
  MEGAPODE:        'bird',
  STARLING:        'bird',
  FANTAIL:         'bird',
  KINGFISHER:      'bird',
  FLYING_FOX:      'bat',
  PLERANDRA:       'leaf',
  INVASIVE:        'ban',
  MERREMIA:        'leaf',
  CROWN_OF_THORNS: 'star',
  MILE_A_MINUTE:   'wind',
  SOLANUM_TORVUM:  'sprout',
  PESTICIDE:       'flaskConical',
  EUTROPHICATION:  'droplets',
  LAND_COVER:      'layers',
  GREEN_SPACE:     'trees',
  OTHER:           'circle'
};

// ── Target → icon name mapping ───────────────────────────────────────

export const TARGET_ICONS = {
  T1:  'map',
  T2:  'sprout',
  T3:  'globe',
  T4:  'bird',
  T6:  'bug',
  T7:  'flaskConical',
  T8:  'waves',
  T10: 'wheat',
  T12: 'trees'
};

/**
 * Convenience: returns the SVG icon for a category key.
 * @param {string} categoryKey
 * @param {number} [size=16]
 */
export function categoryIcon(categoryKey, size = 16) {
  return icon(CATEGORY_ICONS[categoryKey] || 'circle', size);
}

/**
 * Convenience: returns the SVG icon for a target code.
 * @param {string} targetCode
 * @param {number} [size=16]
 */
export function targetIcon(targetCode, size = 16) {
  return icon(TARGET_ICONS[targetCode] || 'circle', size);
}
