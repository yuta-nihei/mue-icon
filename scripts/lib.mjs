import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// 全SVGで共通のルート要素。ここから外れたファイルは lint で弾く(線幅・グリッドの統一)。
export const ROOT_OPEN =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">';
export const ROOT_ATTRS = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1.5',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};
export const VARIANTS = ['line', 'duotone'];
export const CATEGORIES = ['japan', 'document', 'map', 'medical', 'finance', 'life'];
export const NAME_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

export const readJson = (rel) => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
export const svgFile = (variant, name) => join(ROOT, 'svg', variant, `${name}.svg`);

export const toCamel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
export const toPascal = (name) => {
  const c = toCamel(name);
  return c[0].toUpperCase() + c.slice(1);
};

/** ルート要素を除いた中身を1行にして返す。形式が違えば null。 */
export function readBody(file) {
  const src = readFileSync(file, 'utf8').trim();
  if (!src.startsWith(ROOT_OPEN) || !src.endsWith('</svg>')) return null;
  return src
    .slice(ROOT_OPEN.length, -'</svg>'.length)
    .replace(/\s*\n\s*/g, '')
    .trim();
}

export function listSvgNames(variant) {
  const dir = join(ROOT, 'svg', variant);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.svg'))
    .map((f) => f.slice(0, -4));
}

/** icons.json と SVG 原本を結合して返す。lint 通過後に呼ぶこと。 */
export function loadIcons() {
  const { icons } = readJson('icons.json');
  return Object.entries(icons).map(([name, meta]) => {
    const variants = {};
    for (const v of meta.variants) variants[v] = readBody(svgFile(v, name));
    return { name, ...meta, variants };
  });
}
