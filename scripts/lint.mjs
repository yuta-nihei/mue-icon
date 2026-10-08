import { existsSync, readFileSync } from 'node:fs';
import { CATEGORIES, NAME_RE, ROOT_OPEN, VARIANTS, listSvgNames, readJson, svgFile } from './lib.mjs';

const SECONDARY_STYLE = 'style="fill:var(--icon-secondary,currentColor)"';

export function lint() {
  const errors = [];
  const err = (m) => errors.push(m);
  const { icons } = readJson('icons.json');
  const taken = new Set(Object.keys(icons));

  for (const [name, m] of Object.entries(icons)) {
    if (!NAME_RE.test(name)) err(`${name}: 名前は kebab-case にしてください`);
    if (!CATEGORIES.includes(m.category)) err(`${name}: category が不正です (${m.category})`);
    if (!/^\d+\.\d+\.\d+$/.test(m.since ?? '')) err(`${name}: since は semver で指定してください`);
    for (const lang of ['ja', 'en']) {
      if (!Array.isArray(m.tags?.[lang]) || m.tags[lang].length === 0) err(`${name}: tags.${lang} が空です`);
    }
    if (!Array.isArray(m.variants) || !m.variants.includes('line')) err(`${name}: variants に line が必要です`);
    for (const a of m.aliases ?? []) {
      if (!NAME_RE.test(a)) err(`${name}: alias "${a}" は kebab-case にしてください`);
      if (taken.has(a)) err(`${name}: alias "${a}" が他の名前/aliasと重複しています`);
      taken.add(a);
    }

    for (const v of m.variants ?? []) {
      if (!VARIANTS.includes(v)) {
        err(`${name}: 未知の variant ${v}`);
        continue;
      }
      const file = svgFile(v, name);
      if (!existsSync(file)) {
        err(`${name}: svg/${v}/${name}.svg がありません`);
        continue;
      }
      const src = readFileSync(file, 'utf8').trim();
      const where = `svg/${v}/${name}.svg`;
      if (!src.startsWith(ROOT_OPEN) || !src.endsWith('</svg>')) {
        err(`${where}: ルート要素が規定と一致しません(viewBox 24x24 / stroke-width 1.5 など)`);
        continue;
      }
      const body = src.slice(ROOT_OPEN.length, -'</svg>'.length);
      if (/stroke-width|<svg|<script|<style|<image|\sid=|\sclass=|\son\w+=/.test(body))
        err(`${where}: 線幅・id・class・script などは使えません(線幅はルートで固定)`);
      if (/#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|url\(/.test(body)) err(`${where}: 色の直書きは禁止です。currentColor を使ってください`);
      for (const [, attr, val] of body.matchAll(/\s(fill|stroke)="([^"]*)"/g)) {
        if (!['none', 'currentColor'].includes(val)) err(`${where}: ${attr}="${val}" は使えません`);
      }
      for (const [, st] of body.matchAll(/style="([^"]*)"/g)) {
        if (`style="${st}"` !== SECONDARY_STYLE) err(`${where}: style は ${SECONDARY_STYLE} のみ許可です`);
      }
      const hasSecondary = body.includes('--icon-secondary');
      if (v === 'duotone' && !hasSecondary) err(`${where}: duotone には --icon-secondary の面が必要です`);
      if (v !== 'duotone' && hasSecondary) err(`${where}: --icon-secondary は duotone 専用です`);
    }
  }

  for (const v of VARIANTS) {
    for (const f of listSvgNames(v)) {
      if (!icons[f] || !icons[f].variants.includes(v)) err(`svg/${v}/${f}.svg が icons.json に登録されていません`);
    }
  }
  return errors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = lint();
  if (errors.length) {
    console.error(`lint: ${errors.length} 件のエラー\n` + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log('lint: OK');
}
