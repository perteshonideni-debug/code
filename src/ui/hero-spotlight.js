/**
 * Hero figure: a live neural network revealed by a cursor spotlight.
 *
 * The object is generated, not photographed — a four-layer network (3 · 5 · 5 · 1)
 * drawn from real geometry, so the "at rest" and "lit" states are the same nodes
 * and edges and register exactly by construction. At rest the graph reads as
 * faint hairlines; the cursor uncovers a lit copy through an SVG mask, where the
 * nodes pulse in a wave that runs input → hidden → output.
 *
 * Behaviour: confined to the figure, resets on leave, and no pointer events fire
 * on touch devices, so those users see the resting state.
 */

const VIEW_W = 520;
const VIEW_H = 380;
const MASK_RADIUS = 168;

const LAYERS = [
  { x: 84, ys: [120, 190, 260] },
  { x: 208, ys: [92, 141, 190, 239, 288] },
  { x: 332, ys: [92, 141, 190, 239, 288] },
  { x: 452, ys: [190] }
];

function nodes() {
  const out = [];
  LAYERS.forEach((layer, layerIndex) => {
    layer.ys.forEach((y, index) => {
      out.push({ id: `${layerIndex}-${index}`, x: layer.x, y, layer: layerIndex, output: layerIndex === LAYERS.length - 1 });
    });
  });
  return out;
}

function edges(list) {
  const byLayer = [0, 1, 2, 3].map(layer => list.filter(node => node.layer === layer));
  const out = [];
  for (let layer = 0; layer < byLayer.length - 1; layer += 1) {
    byLayer[layer].forEach(from => {
      byLayer[layer + 1].forEach(to => out.push([from, to]));
    });
  }
  return out;
}

const NODES = nodes();
const EDGES = edges(NODES);

export function spotlightFigureMarkup() {
  const edgeMarkup = pair => `<line x1="${pair[0].x}" y1="${pair[0].y}" x2="${pair[1].x}" y2="${pair[1].y}"></line>`;
  const nodeMarkup = (node, lit) => {
    const radius = node.output ? 9 : 5.5;
    const delay = node.layer * 380;
    const cls = node.output ? 'node out' : 'node';
    return lit
      ? `<circle class="${cls}" cx="${node.x}" cy="${node.y}" r="${radius}" style="--d:${delay}ms"></circle>`
      : `<circle class="${node.output ? 'out' : ''}" cx="${node.x}" cy="${node.y}" r="${radius}"></circle>`;
  };

  return `<figure class="hero-figure" data-spotlight aria-hidden="true">
      <svg class="hero-graph" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="presentation" focusable="false">
        <defs>
          <radialGradient id="graph-mask-fade">
            <stop offset="52%" stop-color="#FFFFFF"></stop>
            <stop offset="100%" stop-color="#000000"></stop>
          </radialGradient>
          <mask id="graph-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${VIEW_W}" height="${VIEW_H}">
            <circle data-graph-mask cx="-9999" cy="-9999" r="${MASK_RADIUS}" fill="url(#graph-mask-fade)"></circle>
          </mask>
        </defs>
        <g class="graph-edges">${EDGES.map(pair => edgeMarkup(pair)).join('')}</g>
        <g class="graph-nodes">${NODES.map(node => nodeMarkup(node, false)).join('')}</g>
        <g class="graph-lit" mask="url(#graph-mask)">
          ${EDGES.map(pair => edgeMarkup(pair)).join('')}
          ${NODES.map(node => nodeMarkup(node, true)).join('')}
        </g>
      </svg>
    </figure>`;
}

/**
 * Wires the spotlight mask to the pointer.
 * @param {ParentNode} [root]
 * @returns {() => void} teardown
 */
export function mountHeroSpotlight(root = document) {
  const figure = root.querySelector('[data-spotlight]');
  const svg = figure?.querySelector('.hero-graph');
  const mask = figure?.querySelector('[data-graph-mask]');
  const lit = figure?.querySelector('.graph-lit');
  if (!figure || !svg || !mask || !lit) return () => {};

  const toUserSpace = event => {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  };

  const move = event => {
    const p = toUserSpace(event);
    mask.setAttribute('cx', p.x);
    mask.setAttribute('cy', p.y);
  };

  const enter = () => lit.classList.remove('is-leaving');

  const leave = () => {
    lit.classList.add('is-leaving');
    mask.setAttribute('cx', '-9999');
    mask.setAttribute('cy', '-9999');
  };

  figure.addEventListener('pointerenter', enter);
  figure.addEventListener('pointermove', move);
  figure.addEventListener('pointerleave', leave);

  return () => {
    figure.removeEventListener('pointerenter', enter);
    figure.removeEventListener('pointermove', move);
    figure.removeEventListener('pointerleave', leave);
  };
}
