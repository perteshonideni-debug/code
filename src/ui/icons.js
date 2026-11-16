/**
 * Inline SVG icon set.
 * Kept as raw markup so icons inherit `currentColor` and need no build step,
 * font file or runtime dependency. Stroke geometry follows Lucide (ISC).
 */

const PATHS = {
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 8.97 6.16a2 2 0 0 0 2.06 0L22 7"/>',
  lightbulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/>',
  play: '<path d="m6 3 14 9-14 9V3Z"/>',
  lock: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
};

const SIZES = { sm: 14, md: 16, lg: 18 };

/**
 * @param {keyof PATHS} name
 * @param {{ size?: number | 'sm' | 'md' | 'lg', stroke?: number, label?: string }} [options]
 */
export function icon(name, options = {}) {
  const paths = PATHS[name];
  if (!paths) return '';
  const size = typeof options.size === 'number' ? options.size : SIZES[options.size ?? 'md'];
  const label = options.label
    ? `role="img" aria-label="${String(options.label).replace(/"/g, '&quot;')}"`
    : 'aria-hidden="true"';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${options.stroke ?? 1.6}" stroke-linecap="round" stroke-linejoin="round" ${label}>${paths}</svg>`;
}

export const isIconName = name => name in PATHS;
