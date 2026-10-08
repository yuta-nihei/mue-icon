// README 用のプレビュー画像 docs/preview.svg を生成する。
//   node scripts/make-preview.mjs
// 文字を含めず(フォント差でずれないように)、カテゴリごとに line / duotone を並べる。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, ROOT, ROOT_OPEN, readJson, svgFile } from './lib.mjs';

const { icons } = readJson('icons.json');
const CELL = 64;
const ICON = 36;
const PAD = 24;
const INK = '#1f2937';
const ACCENT = '#e4572e';

const inner = (variant, name) =>
  readFileSync(svgFile(variant, name), 'utf8').trim().slice(ROOT_OPEN.length, -'</svg>'.length);

const rows = [];
for (const cat of CATEGORIES) {
  const names = Object.keys(icons).filter((n) => icons[n].category === cat);
  rows.push(...['line', 'duotone'].map((v) => ({ variant: v, names, gap: v === 'duotone' })));
}
const cols = Math.max(...rows.map((r) => r.names.length));
const width = PAD * 2 + cols * CELL;
const height = PAD * 2 + rows.length * CELL + CATEGORIES.length * 10;

let y = PAD;
let out = '';
for (const [i, r] of rows.entries()) {
  r.names.forEach((n, c) => {
    const x = PAD + c * CELL + (CELL - ICON) / 2;
    out += `<svg x="${x}" y="${y + (CELL - ICON) / 2}" width="${ICON}" height="${ICON}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${inner(r.variant, n)}</svg>\n`;
  });
  y += CELL;
  if (r.gap && i < rows.length - 1) {
    out += `<line x1="${PAD}" x2="${width - PAD}" y1="${y + 5}" y2="${y + 5}" stroke="#e5e7eb"/>\n`;
    y += 10;
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="mue-icons のアイコン一覧(line / duotone)">
<rect width="${width}" height="${height}" rx="12" fill="#ffffff"/>
<g color="${INK}" style="--icon-secondary:${ACCENT}">
${out}</g>
</svg>
`;
mkdirSync(join(ROOT, 'docs'), { recursive: true });
writeFileSync(join(ROOT, 'docs/preview.svg'), svg);
console.log(`docs/preview.svg (${width}x${height}, ${Object.keys(icons).length} icons)`);
