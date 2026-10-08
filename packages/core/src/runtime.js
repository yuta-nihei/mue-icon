export const ROOT_ATTRS = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1.5',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * アイコンをSVG文字列にする(フレームワーク非依存)。
 * 指定した variant が無いアイコンは line にフォールバックする。
 */
export function renderSvg(icon, { variant = 'line', size = 24, title, className } = {}) {
  const body = icon.variants[variant] ?? icon.variants.line;
  const attrs = Object.entries(ROOT_ATTRS)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  const a11y = title ? `role="img" aria-label="${esc(title)}"` : 'aria-hidden="true"';
  const cls = className ? ` class="${esc(className)}"` : '';
  const t = title ? `<title>${esc(title)}</title>` : '';
  return `<svg ${attrs} width="${size}" height="${size}" ${a11y}${cls}>${t}${body}</svg>`;
}
