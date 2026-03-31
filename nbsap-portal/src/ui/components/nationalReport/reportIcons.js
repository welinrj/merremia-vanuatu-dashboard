/**
 * reportIcons.js
 * Real SVG icons from Tabler Icons (MIT License — https://tabler.io/icons)
 * for each NBSAP target in the national report.
 *
 * Each icon is an inline SVG string — no external CDN required,
 * so the report renders correctly when printed to PDF or used offline.
 *
 * Source: https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/{name}.svg
 * License: MIT — Copyright (c) 2020-present Paweł Kuna
 */

/**
 * Returns an inline SVG icon element for a given NBSAP target code.
 *
 * @param {string} code   - target code e.g. 'T1'
 * @param {string} color  - CSS color for the stroke (defaults to currentColor)
 * @param {number} size   - pixel size (width = height, default 26)
 * @returns {string}      - SVG HTML string
 */
export function getTargetIcon(code, color = 'currentColor', size = 26) {
  const attr = `width="${size}" height="${size}" viewBox="0 0 24 24"
    stroke-width="1.75" stroke="${color}" fill="none"
    stroke-linecap="round" stroke-linejoin="round"
    style="display:inline-block;vertical-align:middle;flex-shrink:0"`;

  const ICONS = {

    // T1 — Biodiversity Spatial Planning
    // Tabler "map" icon
    T1: `<svg xmlns="http://www.w3.org/2000/svg" ${attr}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
      <path d="M9 4v13" />
      <path d="M15 7v13" />
    </svg>`,

    // T2 — Ecosystem Restoration
    // Tabler "plant-2" icon
    T2: `<svg xmlns="http://www.w3.org/2000/svg" ${attr}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M2 9a10 10 0 1 0 20 0" />
      <path d="M12 19a10 10 0 0 1 10 -10" />
      <path d="M2 9a10 10 0 0 1 10 10" />
      <path d="M12 4a9.7 9.7 0 0 1 2.99 7.5" />
      <path d="M9.01 11.5a9.7 9.7 0 0 1 2.99 -7.5" />
    </svg>`,

    // T3 — 30×30 Conservation
    // Tabler "shield-check" icon
    T3: `<svg xmlns="http://www.w3.org/2000/svg" ${attr}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" />
      <path d="M15 19l2 2l4 -4" />
    </svg>`,

    // T4 — Species Recovery & Biodiversity
    // Tabler "feather" icon
    T4: `<svg xmlns="http://www.w3.org/2000/svg" ${attr}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M4 20l10 -10m0 -5v5h5m-9 -1v5h5m-9 -1v5h5m-5 -5l4 -4l4 -4" />
      <path d="M19 10c.638 -.636 1 -1.515 1 -2.486a3.515 3.515 0 0 0 -3.517 -3.514c-.97 0 -1.847 .367 -2.483 1m-3 13l4 -4l4 -4" />
    </svg>`,

    // T6 — Invasive Alien Species
    // Tabler "bug" icon
    T6: `<svg xmlns="http://www.w3.org/2000/svg" ${attr}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M9 9v-1a3 3 0 0 1 6 0v1" />
      <path d="M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3" />
      <path d="M3 13l4 0" />
      <path d="M17 13l4 0" />
      <path d="M12 20l0 -6" />
      <path d="M4 19l3.35 -2" />
      <path d="M20 19l-3.35 -2" />
      <path d="M4 7l3.75 2.4" />
      <path d="M20 7l-3.75 2.4" />
    </svg>`,

    // T7 — Pollution Reduction
    // Tabler "droplet" icon
    T7: `<svg xmlns="http://www.w3.org/2000/svg" ${attr}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546z" />
    </svg>`,

    // T8 — Climate & Ocean Impacts
    // Tabler "ripple" icon (waves / ocean)
    T8: `<svg xmlns="http://www.w3.org/2000/svg" ${attr}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 7c3 -2 6 -2 9 0s6 2 9 0" />
      <path d="M3 17c3 -2 6 -2 9 0s6 2 9 0" />
      <path d="M3 12c3 -2 6 -2 9 0s6 2 9 0" />
    </svg>`,

    // T10 — Sustainable Land Use
    // Tabler "seeding" icon
    T10: `<svg xmlns="http://www.w3.org/2000/svg" ${attr}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 10a6 6 0 0 0 -6 -6h-3v2a6 6 0 0 0 6 6h3" />
      <path d="M12 14a6 6 0 0 1 6 -6h3v1a6 6 0 0 1 -6 6h-3" />
      <path d="M12 20l0 -10" />
    </svg>`,

    // T12 — Urban Green & Blue Spaces
    // Tabler "tree" icon
    T12: `<svg xmlns="http://www.w3.org/2000/svg" ${attr}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 13l-2 -2" />
      <path d="M12 12l2 -2" />
      <path d="M12 21v-13" />
      <path d="M9.824 16a3 3 0 0 1 -2.743 -3.69a3 3 0 0 1 .304 -4.833a3 3 0 0 1 4.615 -3.707a3 3 0 0 1 4.614 3.707a3 3 0 0 1 .305 4.833a3 3 0 0 1 -2.919 3.695h-4z" />
    </svg>`,
  };

  return ICONS[code] || '';
}
