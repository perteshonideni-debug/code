/**
 * CodePath brand mark.
 *
 * A rising code path: three waypoints stepping up and to the right, ending in a
 * filled node. It reads as "a path" (the product) and as a node in a network
 * (how the lessons are taught), stays legible at 16–26px, and needs no colour
 * beyond currentColor. The same geometry is inlined in index.html for the boot
 * screen, so keep the two in sync.
 */
/**
 * The wordmark: "Code" in ink, "Path" carrying an ink→indigo gradient so the
 * name ends on the accent the rest of the product is built from.
 */
export function brandNameMarkup() {
  return `<span class="brand-word">Code<span class="brand-word-alt">Path</span></span>`;
}

export function logoMark() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M4.5 19L10 13.5L14 16.5L18.4 8.4"></path>
        <circle cx="19.3" cy="7.3" r="2.7" fill="currentColor" stroke="none"></circle>
        <circle cx="4.5" cy="19" r="1.4" fill="currentColor" stroke="none"></circle>
      </svg>`;
}
