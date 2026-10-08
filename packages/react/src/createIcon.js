import { createElement, forwardRef } from 'react';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const pascal = (name) =>
  name
    .split('-')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('');

export function createIcon(name, variants) {
  const Icon = forwardRef(function Icon({ size = 24, variant = 'line', title, ...rest }, ref) {
    const body = variants[variant] ?? variants.line;
    return createElement('svg', {
      ref,
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.5,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      width: size,
      height: size,
      ...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true }),
      ...rest,
      dangerouslySetInnerHTML: { __html: (title ? `<title>${esc(title)}</title>` : '') + body },
    });
  });
  Icon.displayName = `${pascal(name)}Icon`;
  return Icon;
}
