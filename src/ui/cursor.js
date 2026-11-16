/**
 * Custom pointer: a precise dot plus a trailing ring ("the focus point").
 *
 * - Fine pointers only. Touch and coarse devices keep the platform cursor and
 *   never mount any of this.
 * - The ring trails the dot with easing, then locks onto anything interactive by
 *   contracting and taking the accent colour.
 * - Clicking compresses the ring and emits one expanding ring at the exact point.
 * - Over text fields and the code editor the custom cursor steps aside and the
 *   native caret returns, so typing and selection still behave normally.
 */

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const INTERACTIVE = 'a, button, [role="button"], summary, label, .course-card, .lesson-link, .chapter-row-right .button, .mod, .step, .brand';
const NATIVE_CURSOR = 'input, textarea, select, [contenteditable="true"], .cm-editor, .python-editor-mount';

let teardown = null;

export function initCursor() {
  if (teardown) return teardown;
  if (!window.matchMedia(FINE_POINTER).matches) return () => {};

  // A hot re-run of main.js must not leave a second pair of elements behind:
  // the stale one would keep painting at an old position.
  document.querySelectorAll('.cp-cursor-dot, .cp-cursor-ring').forEach(node => node.remove());

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cp-cursor-dot';
  ring.className = 'cp-cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);
  document.documentElement.classList.add('has-custom-cursor');

  const reduced = window.matchMedia(REDUCED_MOTION).matches;
  let pointerX = -100;
  let pointerY = -100;
  let ringX = -100;
  let ringY = -100;
  let scale = 1;
  let scaleTarget = 1;
  let hovering = false;
  let frame = 0;
  let visible = false;

  const paint = () => {
    dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;
  };

  const tick = () => {
    // Damped follow: the ring arrives without overshooting, and the lock-on
    // grows smoothly rather than snapping.
    const ease = reduced ? 1 : 0.22;
    ringX += (pointerX - ringX) * ease;
    ringY += (pointerY - ringY) * ease;
    scale += (scaleTarget - scale) * (reduced ? 1 : 0.26);
    paint();
    frame = window.requestAnimationFrame(tick);
  };

  const show = () => {
    if (visible) return;
    visible = true;
    dot.classList.add('is-visible');
    ring.classList.add('is-visible');
  };

  const hide = () => {
    visible = false;
    dot.classList.remove('is-visible');
    ring.classList.remove('is-visible');
  };

  const onMove = event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!visible) {
      ringX = pointerX;
      ringY = pointerY;
    }
    show();
    if (reduced) {
      ringX = pointerX;
      ringY = pointerY;
      paint();
    }

    const target = event.target instanceof Element ? event.target : null;
    const overNative = Boolean(target?.closest(NATIVE_CURSOR));
    const overInteractive = Boolean(target?.closest(INTERACTIVE));

    hovering = overInteractive && !overNative;
    scaleTarget = hovering ? 1.45 : 1;

    // Over the hero network the ring becomes a reticle instead of locking on.
    const overNetwork = !overNative && Boolean(target?.closest('[data-spotlight]'));
    if (overNetwork) scaleTarget = 1.15;

    dot.classList.toggle('is-native', overNative);
    ring.classList.toggle('is-native', overNative);
    ring.classList.toggle('is-active', hovering && !overNetwork);
    dot.classList.toggle('is-active', hovering && !overNetwork);
    ring.classList.toggle('is-crosshair', overNetwork);
  };

  const onDown = event => {
    ring.classList.add('is-pressed');
    scaleTarget = 0.8;

    const ripple = document.createElement('div');
    ripple.className = 'cp-cursor-ripple';
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.append(ripple);
    window.setTimeout(() => ripple.remove(), 460);
  };

  const onUp = () => {
    ring.classList.remove('is-pressed');
    scaleTarget = hovering ? 1.45 : 1;
  };

  const onLeaveWindow = () => hide();
  const onEnterWindow = () => show();

  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerdown', onDown, { passive: true });
  document.addEventListener('pointerup', onUp, { passive: true });
  document.addEventListener('pointerleave', onLeaveWindow);
  document.addEventListener('pointerenter', onEnterWindow);

  if (!reduced) frame = window.requestAnimationFrame(tick);
  else paint();

  teardown = () => {
    window.cancelAnimationFrame(frame);
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerdown', onDown);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointerleave', onLeaveWindow);
    document.removeEventListener('pointerenter', onEnterWindow);
    document.documentElement.classList.remove('has-custom-cursor');
    dot.remove();
    ring.remove();
    teardown = null;
  };

  return teardown;
}
