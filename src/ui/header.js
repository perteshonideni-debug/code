/**
 * Glass header state.
 *
 * The header is translucent, so it only reads as glass once something is behind
 * it. This toggles `is-scrolled` past a few pixels, which firms the fill and
 * adds a soft drop so content passing underneath is visibly refracted rather
 * than just dimly showing through.
 *
 * The header markup is re-created on every route change, so `syncHeaderGlass`
 * is also called after navigation instead of relying on a live reference.
 */

const THRESHOLD = 8;

export function syncHeaderGlass() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > THRESHOLD);
}

export function initHeaderGlass() {
  window.addEventListener('scroll', syncHeaderGlass, { passive: true });
  window.addEventListener('resize', syncHeaderGlass, { passive: true });
  syncHeaderGlass();
  return () => {
    window.removeEventListener('scroll', syncHeaderGlass);
    window.removeEventListener('resize', syncHeaderGlass);
  };
}
